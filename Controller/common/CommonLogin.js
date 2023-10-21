const HttpError = require("../../Models/http-error");
const { cookieMaxAge, nodeEnv } = require("../../config/config");
const { findOperatorByEmail } = require("../../helpers/helperFunctions");
const { generateAuthToken } = require("../../utils/generateAuthToken");
const { comparePassword } = require("../../utils/hashPasswords");

const commonLogin = async (values) => {
  const { email, password, doNotLogout, collectionName } = values;
  const Model = require(`../../Models/${collectionName}Model`);
  if (!email || !password) {
    const error = new HttpError("Email and password both are required", 400);
    throw error;
    return;
  }
  const operator = await findOperatorByEmail(collectionName, email);
  const comparedPassword = comparePassword(password, operator.password);
  if (operator && comparedPassword) {
    let cookieParams = {
      httpOnly: true,
      secure: nodeEnv === "production",
      sameSite: "strict",
    };
    if (doNotLogout) {
      cookieParams = { ...cookieParams, maxAge: cookieMaxAge };
    }
    const valuesPassInToken = {
      id: operator.id,
      name: operator.firstName + " " + operator.lastName,
      email: operator.emailAddress,
      operatorType: `${collectionName}`,
      password: operator.password,
    };
    const valuesPassInResponse = {
      id: operator.id,
      firstName: operator.firstName,
      lastName: operator.lastName,
      email: operator.emailAddress,
      operatorType: `${collectionName}`,
      doNotLogout,
    };
    const token = generateAuthToken(valuesPassInToken);
    return { token, cookieParams, valuesPassInResponse };
  } else {
    const err = new HttpError("Incorrect password", 500);
    throw err;
  }
};
module.exports = { commonLogin };

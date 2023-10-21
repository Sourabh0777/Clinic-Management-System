const Reception = require("../../Models/ReceptionModel");
const HttpError = require("../../Models/http-error");
const { hashPassword, comparePassword } = require("../../utils/hashPasswords");
const {
  createReceptionService,
} = require("../../Services/Reception/ReceptionServices");
const { nodeEnv } = require("../../config/config");
const { generateAuthToken } = require("../../utils/generateAuthToken");
const { checkIfUserExists } = require("../../helpers/helperFunctions");
const { commonLogin } = require("../common/CommonLogin");
const { commonGetProfile } = require("../common/commonGetProfile");
const receptionSignup = async (req, res, next) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;
    if (!(firstName || lastName || !emailAddress || !password)) {
      throw new HttpError("All fields are required", 400);
    }
    await checkIfUserExists("Reception", emailAddress);
    const hashedPassword = await hashPassword(password);
    const receptionist = await createReceptionService({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
    });
    const values = {
      id: receptionist.id,
      name: receptionist.firstName + " " + receptionist.lastName,
      email: receptionist.emailAddress,
      operatorType: `${Reception}`,
      password: receptionist.password,
    };
    const jwtToken = generateAuthToken(values);
    return res
      .status(201)
      .cookie("access_token", jwtToken, {
        httpOnly: true,
        secure: nodeEnv === "production",
        sameSite: "strict",
      })
      .json({
        message: "Sign up completed",
        receptionist: {
          firstName: receptionist.firstName,
          lastName: receptionist.lastName,
          emailAddress: receptionist.emailAddress,
        },
      });
  } catch (error) {
    const err = new HttpError("Error created while sign up", 500);
    return next(error || err);
  }
};
const receptionLogin = async (req, res, next) => {
  try {
    const { email, password, doNotLogout } = req.body;
    const loginInput = {
      email,
      password,
      doNotLogout,
      collectionName: "Reception",
    };
    const login = await commonLogin(loginInput);
    if (login) {
      const { token, cookieParams, valuesPassInResponse } = login;
      res.cookie("access_token", token, cookieParams).json({
        message: "Success user logged in.",
        user: valuesPassInResponse,
      });
    }
  } catch (error) {
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};
const getReceptionProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const profile = await commonGetProfile(user);
    return res.send(profile);
  } catch (error) {
    const err = new HttpError("Unable to get Reception profile", 500);
    return next(error || err);
  }
};

module.exports = { receptionSignup, receptionLogin, getReceptionProfile };

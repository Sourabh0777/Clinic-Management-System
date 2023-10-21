const HttpError = require("../Models/http-error");
const bcrypt = require("bcryptjs");

const findOperatorByEmail = async (collectionName, emailAddress) => {
  try {
    const Model = require(`../Models/${collectionName}Model`);
    const operatorDetails = await Model.findOne({ emailAddress }).orFail();

    return operatorDetails;
  } catch (error) {
    const err = new HttpError(
      "This email is not registered with us. Please sign up",
      500
    );
    throw err;
  }
};
const checkIfUserExists = async (collectionName, emailAddress) => {
  const Model = require(`../Models/${collectionName}Model`);
  const existingUser = await Model.findOne({ emailAddress });
  if (existingUser) {
    throw new HttpError(
      `${collectionName} from this emailAddress already exists`,
      404
    );
  } else {
    return;
  }
};

module.exports = { checkIfUserExists, findOperatorByEmail };

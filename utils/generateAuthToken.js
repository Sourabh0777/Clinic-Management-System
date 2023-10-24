const jwt = require("jsonwebtoken");

const { secretKey, jwtExpiresIn } = require("../config/config");
const generateAuthToken = ({ id, name, email, operatorType, password }) => {
  const values = { id, name, email, operatorType, password };
  return jwt.sign(values, secretKey, jwtExpiresIn);
};
const generateUserAuthToken = ({ mobileNo,id }) => {
  const values = {mobileNo,id};
  return jwt.sign(values, secretKey, jwtExpiresIn);
};
module.exports = { generateAuthToken, generateUserAuthToken };

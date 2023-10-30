const jwt = require("jsonwebtoken");

const { secretKey, jwtExpiresIn } = require("../config/config");
const generateAuthToken = ({ id, name, email, operatorType, password }) => {
  const values = { id, name, email, operatorType, password };
  return jwt.sign(values, secretKey, jwtExpiresIn);
};
const generateUserAuthToken = ({ id,mobileNo }) => {
  const values = {id,mobileNo};
  return jwt.sign(values, secretKey, jwtExpiresIn);
};
module.exports = { generateAuthToken, generateUserAuthToken };

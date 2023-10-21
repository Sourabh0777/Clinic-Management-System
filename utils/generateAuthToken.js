const jwt = require("jsonwebtoken");

const { secretKey, jwtExpiresIn } = require("../config/config");
const generateAuthToken = ({ id, name, email, operatorType, password }) => {
  const values = { id, name, email, operatorType, password };
  return jwt.sign(values, secretKey, jwtExpiresIn);
};
module.exports = { generateAuthToken };

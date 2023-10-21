const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
const hashPassword = async (password) => bcrypt.hashSync(password, salt);

const comparePassword = (inputPassword, hashedPassword) =>
  bcrypt.compareSync(inputPassword, hashedPassword);

module.exports = { comparePassword, hashPassword };

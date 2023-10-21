const {  timeRegex } = require("../config/config");
const timeValidator = (value) => {
  return timeRegex.test(value);
};
module.exports = {  timeValidator };

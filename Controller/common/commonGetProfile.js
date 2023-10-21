const HttpError = require("../../Models/http-error");

const commonGetProfile = async (user) => {
  try {
    const Model = require(`../../Models/${user.operatorType}Model`);

    const operator = await Model.findById(user.id).orFail();
    console.log("🚀 ~  ~ operator:", operator)
    return operator;
  } catch (error) {
    const err = new HttpError("unable to find profile", 500);
    throw err;
  }
};
module.exports = { commonGetProfile };

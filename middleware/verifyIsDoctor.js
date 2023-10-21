const verifyIsDoctor = async (req, res, next) => {
  if (req.user.operatorType == "Doctor") {
    return next();
  } else {
    return res.status(401).send("Only doctor's access is allowed");
  }
};
module.exports = { verifyIsDoctor };

const verifyIsReception = async (req, res, next) => {
  if (req.user.operatorType == "Reception") {
    return next();
  } else {
    return res.status(401).send("Only Reception access is allowed.");
  }
};
module.exports = { verifyIsReception };

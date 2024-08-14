const verifyIsStaff = async (req, res, next) => {
   if (req.user.operatorType == "Staff") {
      return next();
   } else {
      return res.status(401).send("Only staff access is allowed.");
   }
};
module.exports = { verifyIsStaff };

const Prescription = require("../../Models/PrescriptionModel");
const HttpError = require("../../Models/http-error");
const getPrescriptions = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const prescriptions = await Prescription.find({ user: userId }).orFail();
    return res.json({ message: "Success", prescriptions });
  } catch (error) {
    const err = new HttpError("Unable to find prescriptions", 500);
    return next(error || err);
  }
};
module.exports = { getPrescriptions };

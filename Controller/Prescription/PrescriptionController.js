const Prescription = require("../../Models/PrescriptionModel");
const HttpError = require("../../Models/http-error");
const getPrescription = async (req, res, next) => {
   try {
      const prescription = await Prescription.findById(req.params.id).orFail();
      return res.json({ message: "Success", prescription });
   } catch (error) {
      const err = new HttpError("Unable to find prescriptions", 500);
      return next(error || err);
   }
};
module.exports = { getPrescription };

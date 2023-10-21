const Specialization = require("../../Models/SpecializationModel");
const HttpError = require("../../Models/http-error");
const {
  addSpecializationService,
} = require("../../Services/Specialization/SpecializationServices");

const addSpecialization = async (req, res, next) => {
  try {
    const { name, relatedSymptoms } = req.body;
    const existingSpecialization = await Specialization.findOne({ name });
    if (existingSpecialization) {
      return next(new HttpError("Specialization Already exists", 401));
    }
    const newSpecialization = await addSpecializationService(
      name,
      relatedSymptoms
    );
    return res.status(201).json({
      message: "Specialization created successfully",
      newSpecialization,
    });
  } catch (error) {
    const err = new HttpError("Error created specialization", 500);
    return next(error || err);
  }
};
module.exports = { addSpecialization };

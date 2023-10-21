const Specialization = require("../../Models/SpecializationModel");
const addSpecializationService = async (name, relatedSymptoms) => {
  const specialization = await Specialization.create({ name, relatedSymptoms });
  return specialization;
};
module.exports = { addSpecializationService };

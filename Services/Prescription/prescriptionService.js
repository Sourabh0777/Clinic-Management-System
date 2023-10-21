const Prescription = require("../../Models/PrescriptionModel");

const createPrescriptionService = async (data) => {
  const prescription = await Prescription.create(data);
  return prescription
};
module.exports = { createPrescriptionService };

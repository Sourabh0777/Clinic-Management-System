const Doctor = require("../../Models/DoctorModel");

const createDoctorService = async (values) => {
  const doctor = await Doctor.create(values);
  return doctor;
};
const getDoctorService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).orFail();
  return doctor;
};
module.exports = { getDoctorService ,createDoctorService};

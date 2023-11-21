const Appointment = require("../../Models/AppointmentModel");
const commonGetAppointmentById = async (id) => {
  try {
    const appointment = await Appointment.findById(id).orFail()
      .populate({ path: "user", select: "firstName lastName" })
      .populate({ path: "doctor", select: "firstName lastName" })
    return appointment;
  } catch (error) {
    const err = new HttpError("unable to fetch doctor list", 500);
    throw error || err;
  }
};
module.exports = { commonGetAppointmentById };

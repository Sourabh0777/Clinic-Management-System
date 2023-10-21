const { model } = require("mongoose");
const Appointment = require("../../Models/AppointmentModel");

const createAppointmentService = async (data) => {
  const appointment = await Appointment.create(data);
  return appointment;
};
module.exports = { createAppointmentService };

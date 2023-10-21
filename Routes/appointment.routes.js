const express = require("express");
const router = express.Router();
const {
  createAppointment,
} = require("../Controller/Appointment/AppointmentController");

router.post("/createAppointment", createAppointment);
module.exports = router;

const express = require("express");
const router = express.Router();
const { createAppointment } = require("../Controller/Appointment/AppointmentController");
const { getTimeSlotDetails } = require("../Controller/Appointment/timeSlotController");

const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
router.use(verifyIsLoggedIn);
router.post("/createAppointment", createAppointment);
router.get("/timeSlotDetails/:id", getTimeSlotDetails);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
   createAppointment,
   getUserPastAppointments,
} = require("../Controller/Appointment/AppointmentController");

const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
router.use(verifyIsLoggedIn);
router.post("/createAppointment", createAppointment);
router.get("/getUserPastAppointments/:userId", getUserPastAppointments);

module.exports = router;

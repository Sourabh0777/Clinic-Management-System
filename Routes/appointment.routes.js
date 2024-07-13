const express = require("express");
const router = express.Router();
const {
   createAppointment,
} = require("../Controller/Appointment/AppointmentController");

const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
router.use(verifyIsLoggedIn);
router.post("/createAppointment", createAppointment);

module.exports = router;

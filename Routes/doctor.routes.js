const express = require("express");
const router = express.Router();
const {
  doctorSignup,
  getDoctorProfile,
  doctorLogin,
  changeProfilePicture,
  getProfilePicture,
  getSchedule,
  getAppointment,
  getPrescription,
  getAppointments,
} = require("../Controller/Doctor/doctorController");
const { addSpecialization } = require("../Controller/Specialization/specializationController");
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
const { verifyIsDoctor } = require("../middleware/verifyIsDoctor");
const { createInitialSchedule } = require("../Controller/DoctorSchedule/DoctorSchedule");

router.post("/signup", doctorSignup);
router.post("/login", doctorLogin);

//Protected Routes
router.use(verifyIsLoggedIn, verifyIsDoctor);
router.get("/profile", getDoctorProfile);
router.post("/createSchedule", createInitialSchedule);
router.get("/appointments", getAppointments);

router.post("/specialization", addSpecialization);
router.put("/profile/picture", changeProfilePicture);
router.get("/profile/picture/:pictureId", getProfilePicture);
router.get("/schedule", getSchedule);
router.get("/appointment/:id", getAppointment);
router.get("/prescription/:id", getPrescription);

//Specialization
module.exports = router;

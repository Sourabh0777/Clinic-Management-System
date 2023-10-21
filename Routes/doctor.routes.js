const express = require("express");
const router = express.Router();
const {
  doctorSignup,
  getDoctorProfile,
  doctorLogin,
} = require("../Controller/Doctor/doctorController");
const {
  addSpecialization,
} = require("../Controller/Specialization/specializationController");
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
const { verifyIsDoctor } = require("../middleware/verifyIsDoctor");
const { createInitialSchedule } = require("../Controller/DoctorSchedule/DoctorSchedule");


router.post("/signup", doctorSignup);
router.post("/login", doctorLogin);


//Protected Routes
router.use(verifyIsLoggedIn,verifyIsDoctor);
router.get("/profile", getDoctorProfile);
router.post("/createSchedule", createInitialSchedule);

router.post("/specialization", addSpecialization);


//Specialization
module.exports = router;

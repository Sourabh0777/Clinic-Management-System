const express = require("express");
const router = express.Router();
const {
  UserSignUp,
  doctorsList,
  selectedDoctorSchedule,UserLogin,UserSignUpVerify
} = require("../Controller/User/userController");
router.post("/signup", UserSignUp);
router.post("/signup/verify", UserSignUpVerify);

router.post("/login", UserLogin);

router.get("/doctorsList", doctorsList);
router.get("/doctor/schedule/:id", selectedDoctorSchedule);

module.exports = router;

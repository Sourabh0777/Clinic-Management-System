const express = require("express");
const router = express.Router();
const {
  UserSignUp,
  doctorsList,
  selectedDoctorSchedule,UserLogin,UserSignUpVerify,UserLoginVerify
} = require("../Controller/User/userController");
router.post("/signup", UserSignUp);
router.post("/signup/verify", UserSignUpVerify);

router.post("/login", UserLogin);
router.post("/login/verify", UserLoginVerify);

router.get("/doctorsList", doctorsList);
router.get("/doctor/schedule/:id", selectedDoctorSchedule);

module.exports = router;

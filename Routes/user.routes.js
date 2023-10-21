const express = require("express");
const router = express.Router();
const { UserSignUp,doctorsList,selectedDoctorSchedule } = require("../Controller/User/userController");
router.post("/signup", UserSignUp);
router.get("/doctorsList", doctorsList);
router.get("/doctor/schedule/:id", selectedDoctorSchedule);



module.exports = router;

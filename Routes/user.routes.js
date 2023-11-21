const express = require("express");
const router = express.Router();
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");

const {
  UserSignUp,
  doctorsList,
  selectedDoctorSchedule,
  UserLogin,
  UserSignUpVerify,
  UserLoginVerify,
  updateUSerProfile,
  getUserProfile,
  deleteUser,
  getLabReports,
  getUserAppointments
} = require("../Controller/User/userController");
router.post("/signup", UserSignUp);
router.post("/signup/verify", UserSignUpVerify);

router.post("/login", UserLogin);
router.post("/login/verify", UserLoginVerify);
router.use(verifyIsLoggedIn);
router.get("/doctorsList", doctorsList);
router.get("/doctor/schedule/:id", selectedDoctorSchedule);
router.put("/updateProfile", updateUSerProfile);
router.get("/getUserProfile", getUserProfile);
router.get("/getLabReports", getLabReports);
router.get("/appointments", getUserAppointments);
// router.get("/getLabReports", getUserUpcomingAppointment);


router.delete("/deleteUser", deleteUser);

module.exports = router;

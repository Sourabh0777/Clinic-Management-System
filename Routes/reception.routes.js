const express = require("express");
const router = express.Router();
const {
  receptionSignup,
  receptionLogin,
  getReceptionProfile,
  changeProfilePicture,
  getProfilePicture,
  getDoctorList,
  getDoctorProfile,
  getDoctorSchedule,
  getAppointmentDetails,
  updateVitals,
  getPrescriptionFileById,
  cancelAppointment,
  createUser,
  searchUser,
} = require("../Controller/Reception/receptionController");
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
const { verifyIsReception } = require("../middleware/verifyIsReception");

// Sign up LOgin
router.post("/signup", receptionSignup);
router.post("/login", receptionLogin);

//Verify Reception Related Api
// router.use(verifyIsLoggedIn, verifyIsReception);

//Reception Profile Related API
router.get("/profile", getReceptionProfile);
router.put("/profile/picture", changeProfilePicture);
router.get("/profile/picture/:pictureId", getProfilePicture);

// Get Doctor and schedule related api
router.get("/doctorList", getDoctorList);
router.get("/doctor/:id", getDoctorProfile);
router.get("/schedule/:id", getDoctorSchedule);
router.get("/appointment/:id", getAppointmentDetails);
//Vitals / Prescription
router.post("/vitals", updateVitals);
router.get("/prescription/:prescriptionFile", getPrescriptionFileById);
router.put("/cancelAppointment/:id", cancelAppointment);

//Reception User/Patient Related API
router.post("/createUser", createUser);
router.post("/searchUser", searchUser);

module.exports = router;

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
  cancelAppointment
} = require("../Controller/Reception/receptionController");
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
const { verifyIsReception } = require("../middleware/verifyIsReception");

router.post("/signup", receptionSignup);
router.post("/login", receptionLogin);

router.use(verifyIsLoggedIn, verifyIsReception);
router.get("/profile", getReceptionProfile);
router.put("/profile/picture", changeProfilePicture);
router.get("/profile/picture/:pictureId", getProfilePicture);
router.get("/doctorList", getDoctorList);
router.get("/doctor/:id", getDoctorProfile);
router.get("/schedule/:id", getDoctorSchedule);
router.get("/appointment/:id", getAppointmentDetails);
router.put("/vitals/:id", updateVitals);
router.get("/prescription/:prescriptionFile", getPrescriptionFileById);
router.put("/cancelAppointment/:id", cancelAppointment);

module.exports = router;

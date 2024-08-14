const express = require("express");
const router = express.Router();
const {
   staffSignup,
   staffLogin,
   getstaffProfile,
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
} = require("../Controller/Staff/staffController");
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
const { verifyIsStaff } = require("../middleware/verifyIsStaff");

// Sign up LOgin
router.post("/signup", staffSignup);
router.post("/login", staffLogin);

//Verify staff Related Api
router.use(verifyIsLoggedIn, verifyIsStaff);

//staff Profile Related API
router.get("/profile", getstaffProfile);
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

//staff User/Patient Related API
router.post("/createUser", createUser);
router.post("/searchUser", searchUser);

module.exports = router;

const express = require("express");
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");
const {
   getPrescriptions,
} = require("../Controller/Prescription/PrescriptionController");
const router = express.Router();
router.use(verifyIsLoggedIn);
router.post("/", getPrescriptions);

module.exports = router;

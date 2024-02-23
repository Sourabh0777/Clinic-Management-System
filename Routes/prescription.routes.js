const express = require("express");
const {
  getPrescriptions,
  uploadPrescription,
} = require("../Controller/Prescription/PrescriptionController");
const router = express.Router();
router.post("/", getPrescriptions);
router.post("/uploadPrescription", uploadPrescription);

module.exports = router;

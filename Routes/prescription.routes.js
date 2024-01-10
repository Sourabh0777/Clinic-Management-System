const express = require("express");
const { getPrescriptions } = require("../Controller/Prescription/PrescriptionController");
const router = express.Router();
router.post("/", getPrescriptions);

module.exports = router;

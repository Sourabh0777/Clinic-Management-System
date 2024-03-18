const express = require("express");
const {
   getPrescription,
} = require("../Controller/Prescription/PrescriptionController");
const router = express.Router();
router.post("/:id", getPrescription);

module.exports = router;

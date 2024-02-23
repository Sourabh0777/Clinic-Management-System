const express = require("express");
const {
   getPrescriptions,
} = require("../Controller/Prescription/PrescriptionController");
const router = express.Router();
router.get("/", getPrescriptions); //TODO:method suld be GET (prev -> POST)

module.exports = router;

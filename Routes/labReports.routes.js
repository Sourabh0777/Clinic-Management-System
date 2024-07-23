const express = require("express");
const router = express.Router();
const {
   uploadReportFiles,
   getReport,
   getReports,
   getUploadedPrescriptions,
} = require("../Controller/LabReports/LabReportController");

router.post("/uploadReports", uploadReportFiles);
router.get("/report/:id", getReport);
router.get("/reports/:userId", getReports);
router.get("/prescriptions/:userId", getUploadedPrescriptions);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  uploadReportFiles,
  createReportType,
  getReport,
} = require("../Controller/LabReports/LabReportController");

router.post("/createReportType", createReportType);
router.get("/report/:reportId", getReport);

router.post("/uploadReports", uploadReportFiles);

module.exports = router;

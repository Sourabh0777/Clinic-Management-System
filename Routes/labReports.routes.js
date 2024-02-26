const express = require("express");
const router = express.Router();
const {
   uploadReportFiles,
   createReportType,
   getReport,
   getReports,
} = require("../Controller/LabReports/LabReportController");

router.post("/createReportType", createReportType);
router.post("/uploadReports", uploadReportFiles);
router.get("/report/:reportId", getReport);
router.post("/reports", getReports);

module.exports = router;

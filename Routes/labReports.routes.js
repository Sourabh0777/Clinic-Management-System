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
router.get("/reports", getReports); //TODO:method should be GET (prev - POST)

module.exports = router;

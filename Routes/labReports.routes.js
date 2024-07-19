const express = require("express");
const router = express.Router();
const {
   uploadReportFiles,
   getReport,
   getReports,
} = require("../Controller/LabReports/LabReportController");

router.post("/uploadReports", uploadReportFiles);
router.get("/report/:id", getReport);
router.get("/reports/:userId", getReports);

module.exports = router;

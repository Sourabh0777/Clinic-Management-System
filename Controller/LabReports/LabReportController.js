const HttpError = require("../../Models/http-error");
const { reportsValidate } = require("../../utils/reportsValidate");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { uploadReportsDirectoryPath, baseUrl } = require("../../config/config");
const ReportType = require("../../Models/ReportTypeModel");
const LabReport = require("../../Models/LabReportModel");
const fs = require("fs");

const createReportType = async (req, res, next) => {
  try {
    const { typeName } = req.body;
    const newReportType = new ReportType({
      typeName,
    });
    const savedReportType = await newReportType.save();
    res.status(201).json(savedReportType);
  } catch (error) {
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};

const uploadReportFiles = async (req, res, next) => {
  const uploadReportsDirectory = path.resolve(__dirname, uploadReportsDirectoryPath);
  try {
    const { user, doctor, typename, createdDate } = req.body;
    if (!typename) {
      const err = new HttpError("*Report Type Required", 400);
      next(err);
    }
    const labReport = new LabReport({
      user,
      doctor,
      typename,
      createdDate,
    });

    const reports = req.files.reports;
    if (!req.files || !!reports === false) {
      const err = new HttpError("No files attached", 400);
      return next(err);
    }
    const validateResult = reportsValidate(reports);
    if (validateResult.error) {
      const err = new HttpError(validateResult.error, 400);
      return next(err);
    }

    let reportTable = [];
    if (Array.isArray(reports)) {
      reportTable = reports;
    } else reportTable.push(reports);
    for (let report of reportTable) {
      const reportUniqueID = uuidv4();
      const extension = path.extname(report.name);
      const reportName = reportUniqueID + extension;
      const uploadPath = uploadReportsDirectory + "/" + reportName;
      const fileUrl = "/lab/report/" + reportName;
      labReport.url.push(fileUrl);
      report.mv(uploadPath, function (err) {
        if (err) {
          const err = new HttpError("Unable to upload reports", 500);
          return next(err);
        }
      });
    }
    await labReport.save();
    res.json({ message: "File Uploaded", labReport });
  } catch (error) {
    console.log(error);
    const err = new HttpError("Unable to upload reports", 500);
    return next(error || err);
  }
};

const getReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const filePath = path.join(__dirname, "../../FilesUploaded/LabReports/" + reportId);
    const a = fs.existsSync(filePath);
    // Check if the file exists before sending it
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      const err = new HttpError("Report not found", 404);
      return next(err);
    }
  } catch (error) {
    console.error(error); // Log the specific error for debugging
    const err = new HttpError("Unable to retrieve the report", 500);
    return next(err);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      const err = new HttpError("User ID is required", 400);
      return next(err);
    }
    const labReports = await LabReport.find({ user: userId });
    if (!labReports) {
      const err = new HttpError("No reports Found", 500);
      return next(err);
    }
    return res.json({ message: "Found Reports", labReports });
  } catch (error) {
    console.error("Error fetching lab reports:", error);
    const err = new HttpError("Unable to fetch lab reports", 500);
    return next(error || err);
  }
};

module.exports = { uploadReportFiles, createReportType, getReport, getReports };

const { default: mongoose } = require("mongoose");
const HttpError = require("../../Models/http-error");
const LabReport = require("../../Models/LabReportModel");

//Cloudinary Config
const cloudinary = require("cloudinary").v2;
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadReportFiles = async (req, res, next) => {
   try {
      const { user, doctor, reportName } = req.body;
      if (!reportName) {
         const err = new HttpError("*Report Name Required", 400);
         return next(err);
      }

      const labReport = new LabReport({
         user,
         doctor,
         reportName,
      });

      const report = req.files?.report;
      if (!report) {
         const err = new HttpError("No file attached", 400);
         return next(err);
      }

      // Upload to Cloudinary
      cloudinary.uploader
         .upload_stream(
            {
               resource_type: "auto",
               folder: `Mittal Hospital/Patient/${user}/Lab Reports`,
            },
            async (error, result) => {
               if (error) {
                  console.error(error);
                  const err = new HttpError("Unable to upload report", 500);
                  return next(error || err);
               }

               labReport.url = result.secure_url;

               try {
                  await labReport.save();
                  res.json({ message: "File Uploaded", labReport });
               } catch (err) {
                  console.error(err);
                  const error = new HttpError("Unable to save report", 500);
                  next(error);
               }
            }
         )
         .end(report.data);
   } catch (error) {
      console.error(error);
      const err = new HttpError("Unable to upload report", 500);
      return next(error || err);
   }
};

const getReport = async (req, res, next) => {
   const reportId = req.params.id;
   try {
      const labReport = await LabReport.findById(reportId)
         .populate({ path: "user", select: "firstName lastName" })
         .populate({ path: "doctor", select: "firstName lastName" });

      if (!labReport) {
         const error = new HttpError("Report not found", 404);
         return next(error);
      }

      res.json({ labReport });
   } catch (error) {
      console.error(error);
      const err = new HttpError("Unable to retrieve report", 500);
      return next(error || err);
   }
};

const getReports = async (req, res, next) => {
   const userId = req.params.userId;

   // Validate ID format
   if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new HttpError("Invalid user ID format", 400);
      return next(error);
   }

   try {
      const reports = await LabReport.find({
         user: userId,

         reportName: { $ne: "Prescription" },
      })
         .populate({ path: "user", select: "firstName lastName" })
         .populate({ path: "doctor", select: "firstName lastName" })
         .sort({ createdAt: -1 }); // Optional: Sort by creation date, newest first

      if (reports.length === 0) {
         const error = new HttpError("No reports found for this user", 404);
         return next(error);
      }

      res.json({ reports });
   } catch (error) {
      console.error("Error retrieving reports:", error);
      const err = new HttpError("Unable to retrieve reports", 500);
      return next(err);
   }
};

const getUploadedPrescriptions = async (req, res, next) => {
   const userId = req.params.userId;

   // Validate ID format
   if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new HttpError("Invalid user ID format", 400);
      return next(error);
   }

   try {
      const reports = await LabReport.find({
         user: userId,
         reportName: "Prescription",
      })
         .populate({ path: "user", select: "firstName lastName" })
         .populate({ path: "doctor", select: "firstName lastName" })
         .sort({ createdAt: -1 }); // Optional: Sort by creation date, newest first

      if (reports.length === 0) {
         const error = new HttpError(
            "No uploaded prescriptions found for this user",
            404
         );
         return next(error);
      }

      res.json({ reports });
   } catch (error) {
      console.error("Error retrieving prescriptions:", error);
      const err = new HttpError("Unable to retrieve prescriptions", 500);
      return next(err);
   }
};

module.exports = {
   uploadReportFiles,
   getReport,
   getReports,
   getUploadedPrescriptions,
};

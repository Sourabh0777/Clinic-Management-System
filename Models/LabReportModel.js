const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index: true,
      },
      doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
      staff: { type: mongoose.Schema.Types.ObjectId, ref: "staff" },
      reportName: {
         type: String,
         required: true,
      },
      url: { type: String, required: true },
   },
   {
      timestamps: true,
   }
);

const LabReport = mongoose.model("LabReport", labReportSchema);

module.exports = LabReport;

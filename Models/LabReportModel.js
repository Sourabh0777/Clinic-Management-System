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
    reception: { type: mongoose.Schema.Types.ObjectId, ref: "Reception" },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReportType",
      required: true,
    },
    url: [{ type: String, required: true }],
    createdDate: { type: Date, default: Date.now ,index: true},
  },
  {
    timestamps: true,
  }
);

const LabReport = mongoose.model("LabReport", labReportSchema);

module.exports = LabReport;
//Short hand
// user ID , type , reception , doctor

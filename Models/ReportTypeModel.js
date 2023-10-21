const mongoose = require('mongoose');

const reportTypeSchema = new mongoose.Schema({
  typeName: { type: String, required: true },
});

const ReportType = mongoose.model("ReportType", reportTypeSchema);

module.exports = ReportType;

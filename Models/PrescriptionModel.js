const mongoose = require("mongoose");
const vitalsSchema = new mongoose.Schema({
  bloodPressure: {
    type: String,
  },
  heartRate: {
    type: Number,
  },
  temperature: {
    type: Number,
  },
  respiratoryRate: {
    type: Number,
  },
});
const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prescriptionUrl: {
    type: String,
  },
  vitals: {
    type: vitalsSchema
  },
  isLocked:{type:Boolean, default:false},
  previousPrescriptions: {
    type: String,
  },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
//Short hand
//Required = date , userId,
//Not required = appointmentId,previousPrescriptions , vitals, canvas

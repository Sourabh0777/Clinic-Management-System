const mongoose = require("mongoose");

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
  canvas: {
    type: String,
  },
  vitals: {
    type: String,
  },
  previousPrescriptions: {
    type: String,
  },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
//Short hand
//Required = date , userId,
//Not required = appointmentId,previousPrescriptions , vitals, canvas

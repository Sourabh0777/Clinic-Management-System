const mongoose = require("mongoose");
const vitalsSchema = new mongoose.Schema({
   weight: {
      type: Number,
   },
   height: {
      type: Number,
   },
   bloodPressure: {
      type: String,
   },
   bloodSugar: {
      type: Number,
   },
   priorDisease: {
      type: String,
   },
   priorMedication: {
      type: String,
   },
});

const prescriptionSchema = new mongoose.Schema(
   {
      appointmentId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Appointment",
         required: false,
      },

      staff: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "staff",
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      prescriptionData: {
         paths: [[String]],
      },
      vitals: {
         type: vitalsSchema,
      },
      isLocked: { type: Boolean, default: false },
      date: {
         type: Date,
         required: true,
      },
   },
   { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;

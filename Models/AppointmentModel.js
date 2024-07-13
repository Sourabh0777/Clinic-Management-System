const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      doctor: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Doctor",
         required: true,
      },
      reception: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Reception",
      },
      prescription: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Prescription",
         required: true,
      },
      appointmentDate: {
         type: Date,
         required: true,
      },
      appointmentType: {
         type: String,
         enum: ["OPD", "Emergency", "IPD"],
         required: true,
      },
      status: {
         type: String,
         default: "pending",
         enum: ["pending", "accepted", "completed", "canceled"],
      },
      paymentStatus: { type: String, enum: ["Paid", "Unpaid"] },
      paymentMethod: {
         type: String,
         default: "Cash",
         enum: ["Cash", "Card", "UPI", "Cheque"],
      },
      totalAmount: { type: Number },
      appointmentNotes: { type: String },
      nextCheckupDate: {
         type: Date,
      },
   },
   {
      timestamps: true,
   }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;

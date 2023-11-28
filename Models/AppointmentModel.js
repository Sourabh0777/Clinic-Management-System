const mongoose = require("mongoose");
const { timeValidator } = require("../helpers/validatorFunctions");

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
    modeOfAppointment: {
      type: String,
      enum: ["app", "reception"],
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeSlot",
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
      enum: ["pending", "Active", "completed", "canceled"],
    },
    consultationFee: { type: Number },
    paymentStatus: { type: String, enum: ["Paid", "Unpaid"] },
    paymentMethod: { type: String, enum: ["Cash", "Card", "Online"] },
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
// Short hand
// required = user, doctor, reception, prescription, appointmentDate, timeSlot ,appointmentType
// not required =status, consultationFee, paymentStatus, paymentMethod, totalAmount, appointmentNotes, nextCheckupDate

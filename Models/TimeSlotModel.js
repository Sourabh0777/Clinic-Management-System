const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  slotStartTime: Date,
  slotEndTime: Date,
  status: {
    type: String,
    enum: ["available", "booked", "unavailable"],
    default: "available",
  },
  appointmentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    default: null,
  },
  disabled: { type: Boolean, default: false },
});

const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);
module.exports = TimeSlot;

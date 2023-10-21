const mongoose = require("mongoose");

// Define a schema for the time slot
const timeSlotSchema = new mongoose.Schema({
  slotStartTime: Date,
  slotEndTime: Date,
  status: { type: String, enum: ["available", "booked", "unavailable"] },
  appointmentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    default: null,
  },
  disabled: { type: Boolean, default: false },
});

// Define a schema for the availability slot
const availabilitySlotSchema = new mongoose.Schema({
  date: Date,
  timeSlots: [timeSlotSchema],
});

// Define the main schedule configuration schema
const scheduleConfigSchema = new mongoose.Schema(
  {
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    workingDays: [
      {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday","Sunday"],
      },
    ],
    startTime: String,
    endTime: String,
    slotDuration: String,
    availability: [availabilitySlotSchema],
  },
  {
    timestamps: true,
  }
);

// Create a model using the schema
const ScheduleConfig = mongoose.model("ScheduleConfig", scheduleConfigSchema);

module.exports = ScheduleConfig;

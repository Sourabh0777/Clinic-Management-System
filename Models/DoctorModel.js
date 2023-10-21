const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter the first name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please enter the last name"],
    trim: true,
  },
  mobileNumber: {
    type: Number,
    required: [true, "Please enter contact information"],
    trim: true,
  },
  specializationID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: [true, "Please select a specialization"],
    },
  ],
  experience: {
    type: Number,
    required: [true, "Please enter the experience"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  chargesForOPDExtra: {
    type: Number,
    required: [true, "Please enter charges for OPD Extra"],
  },
  emailAddress: {
    type: String,
    required: [true, "Please enter an emailAddress address"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    trim: true,
  },
  scheduleConfigID:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"ScheduleConfig"
  }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;

// short hand
// firstName , lastName , mobileNumber, specializationID, experience , rating , chargesForOPDExtra,emailAddress, password

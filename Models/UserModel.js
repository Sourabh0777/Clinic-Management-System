const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
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
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Please select a gender"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please enter the date of birth"],
    },
    mobileNumber: {
      type: Number,
      required: [true, "Please enter contact information"],
      unique: true,
      trim: true,
    },
    otherContactNo: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      required: [true, "Please enter the state"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please enter the address"],
      trim: true,
    },
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
//Schema Short hand
// firstName , lastName , gender , dateOfBirth ,mobileNumber , medicalHistory, otherContactNo ,  state, address, emailAddress, password

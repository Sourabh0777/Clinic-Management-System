const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         trim: true,
         required: true,
      },
      lastName: {
         type: String,
         trim: true,
      },
      gender: {
         type: String,
         enum: ["Male", "Female", "Other"],
      },
      dateOfBirth: {
         type: Date,
      },
      age: {
         type: String,
         required: true,
      },
      mobileNumber: {
         type: String,
         required: [true, "Please enter contact information"],
         unique: true,
         trim: true,
      },
      lastOtp: {
         type: Number,
         trim: true,
      },
      otherContactNo: {
         type: String,
         trim: true,
      },
      state: {
         type: String,
         trim: true,
      },
      address: {
         type: String,
         trim: true,
      },
      emailAddress: {
         type: String,
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
// firstName , lastName , gender , dateOfBirth ,mobileNumber , otherContactNo ,  state, address, emailAddress

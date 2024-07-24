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
   gender: {
      type: String,
      required: [true, "Please select gender"],
   },
   mobileNumber: {
      type: String,
      required: [true, "Please enter contact information"],
      unique: true,
      trim: true,
   },
   profilePictureUrl: { type: String, trim: true },
   specialization: {
      type: String,
      required: [true, "Please enter specialization"],
   },
   experience: {
      type: String,
      required: [true, "Please enter the experience in years"],
   },
   consultationFee: {
      type: String,
      required: [true, "Please enter consultation Fee "],
   },
   qualifications: { type: String, required: true },
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
});
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;

const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: [true, "Please enter the staffist's name"],
      trim: true,
   },
   lastName: {
      type: String,
      required: [true, "Please enter the staffist's name"],
      trim: true,
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
   profilePictureUrl: { type: String, trim: true },
});

const Staff = mongoose.model("staff", staffSchema);

module.exports = Staff;

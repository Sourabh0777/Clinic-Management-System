const mongoose = require("mongoose");

const receptionSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter the receptionist's name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please enter the receptionist's name"],
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
});

const Reception = mongoose.model("Reception", receptionSchema);

module.exports = Reception;

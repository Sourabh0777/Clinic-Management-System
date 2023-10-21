require("dotenv").config();
const mongoose = require("mongoose");
const { url } = require("./config");
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed");
  }
};
module.exports = connectDB;

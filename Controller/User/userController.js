const Doctor = require("../../Models/DoctorModel");

const User = require("../../Models/UserModel");
const HttpError = require("../../Models/http-error");

//twilio
const { twilioSid, twilioAuthToken, twilioNo } = require("../../config/config");
const { generateRandomOTP } = require("../../config/twillio");
const client = require("twilio")(twilioSid, twilioAuthToken);

let OTP, mobileNumber;
const UserSignUp = async (req, res, next) => {
  try {
    mobileNumber = req.body;
    if (!mobileNumber) {
      throw new HttpError("Enter your mobile no.", 422);
    }
    const mobileNoExists = await User.findOne({ mobileNumber: mobileNumber });
    if (mobileNoExists) {
      const error = new HttpError(
        "User already exist from this mobile no.",
        400
      );
      return next(error);
    }
    OTP = generateRandomOTP();

    await client.messages.create({
      body: `Your OTP is: ${OTP}`,
      to: `+91${mobileNumber}`,
      from: `${twilioNo}`,
    });

    res.send("Message Sent");
  } catch (error) {
    const err = new HttpError("Error created while sign up", 400);
    return next(error || err);
  }
};
const UserSignUpVerify = async (req, res, next) => {
  try {
    const { otp } = req.body;
    res.send("Working");
  } catch (error) {
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};
const UserLogin = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;

    const otp = generateRandomOTP();
    console.log("🚀 ~ file: userController.js:77 ~ UserLogin ~ otp:", otp);

    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+1 415 403 2525",
      to: mobileNumber,
    });
    res.send("Message Sent");
  } catch (error) {
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};

const doctorsList = async (req, res, next) => {
  try {
    const doctorsList = await Doctor.find({}).select().orFail();
    console.log(
      "🚀 ~ file: userController.js:73 ~ doctorsList ~ doctorsList:",
      doctorsList
    );
    res.json({ message: "Success", doctorsList });
  } catch (error) {
    const err = new HttpError("unable to get doctors list", 500);
    return next(error || err);
  }
};
const selectedDoctorSchedule = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findOne({ _id: doctorId })
      .select("-password")
      .populate("scheduleConfigID")
      .orFail();
    res.json({ message: "success", doctor });
  } catch (error) {
    const err = new HttpError("unable to get Schedule fo the doctor", 500);
    return next(error || err);
  }
};

module.exports = {
  UserSignUp,
  doctorsList,
  selectedDoctorSchedule,
  UserLogin,
  UserSignUpVerify,
};

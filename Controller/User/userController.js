const mongoose = require("mongoose");
const Doctor = require("../../Models/DoctorModel");

const User = require("../../Models/UserModel");
const HttpError = require("../../Models/http-error");

//twilio
const { twilioSid, twilioAuthToken, twilioNo } = require("../../config/config");
const { generateRandomOTP } = require("../../config/twillio");
const { generateUserAuthToken } = require("../../utils/generateAuthToken");
const client = require("twilio")(twilioSid, twilioAuthToken);

let OTP, mobileNumber;
const UserSignUp = async (req, res, next) => {
  try {
    mobileNumber = req.body.mobileNumber;
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
    console.log("🚀 ~ OTP:", OTP);
    console.log("🚀 ~  twilioNo:", twilioNo);
    console.log("🚀 ~ mobileNumber:", mobileNumber);
    const message = {
      body: `Your OTP is: ${OTP}`,
      to: `+91${mobileNumber}`,
      from: `${twilioNo}`,
    };
    console.log(
      "🚀 ~~ message:",
      message
    );
    client.messages.create(message).then((message) => {
      res.send("OTP Sent");
    });
  } catch (error) {
    const err = new HttpError("Error created while sign up", 400);
    return next(error || err);
  }
};
const UserSignUpVerify = async (req, res, next) => {
  try {
    const { otp } = req.body;
    console.log("🚀 ~  OTP:", OTP)

    if (otp !== OTP) {
      const err = new HttpError("OTP not matched", 400);
      return next(err);
    }
    const userId = new mongoose.Types.ObjectId();
    const user = await User.create({
      _id: userId,
      mobileNumber: mobileNumber,
    });
    const jwtToken = generateUserAuthToken({ userId, mobileNumber });

    return res
      .status(201)
      .cookie("UserAccess_token", jwtToken, {
        httpOnly: true,
        secure: nodeEnv === "production",
        sameSite: "strict",
      })
      .json({
        message: "Sign up completed",
        user,
      });
  } catch (error) {
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};
let loginOTP, LoginMobileNO;
const UserLogin = async (req, res, next) => {
  try {
    LoginMobileNO = req.body.mobileNumber;
    const user = await User.findOne({ mobileNumber: LoginMobileNO });
    if (!user) {
      const error = new HttpError(
        "No user exists from this mobile no, Sign up",
        400
      );
      return next(error);
    }
    loginOTP = generateRandomOTP();
    await client.messages.create({
      body: `Your OTP is: ${loginOTP}`,
      to: `+91${LoginMobileNO}`,
      from: `${twilioNo}`,
    });
    res.send("Message Sent");
  } catch (error) {
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};
const UserLoginVerify = async (req, res, next) => {
  try {
    const { otp, doNotLogout } = req.body;
    if (otp !== loginOTP) {
      const err = new HttpError("OTP not matched", 400);
      return next(err);
    }
    const user = await User.findOne({ mobileNumber: LoginMobileNO });
    if (!user) {
      const error = new HttpError(
        "No user exists from this mobile no, Sign up",
        400
      );
    }
    console.log("user:", user);

    const jwtToken = generateUserAuthToken({ id: user.id, mobileNumber });
    let cookieParams = {
      httpOnly: true,
      secure: nodeEnv === "production",
      sameSite: "strict",
    };
    if (doNotLogout) {
      cookieParams = { ...cookieParams, maxAge: cookieMaxAge };
    }

    return res.cookie("access_token", jwtToken, cookieParams).json({
      message: "User logged in.",
      user,
    });
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
  UserLoginVerify,
};

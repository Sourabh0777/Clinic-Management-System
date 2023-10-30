const mongoose = require("mongoose");
const Doctor = require("../../Models/DoctorModel");

const User = require("../../Models/UserModel");
const HttpError = require("../../Models/http-error");
const Otp = require("../../Models/OtpModel");
const { generateUserAuthToken } = require("../../utils/generateAuthToken");

//twilio
const {
  twilioSid,
  twilioAuthToken,
  twilioNo,
  cookieMaxAge,
  nodeEnv,
} = require("../../config/config");
const { generateRandomOTP } = require("../../config/twillio");
const client = require("twilio")(twilioSid, twilioAuthToken);

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

    const OTP = generateRandomOTP();
    const otp = new Otp({ otp: OTP, mobileNumber });
    await otp.save();
    if (!otp) {
      const error = new HttpError("Unable to create otp,try again", 400);
      return next(error);
    }
    const message = {
      body: `Your OTP is: ${OTP}`,
      to: `+91${mobileNumber}`,
      from: `${twilioNo}`,
    };
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
    const { otp, mobileNumber } = await req.body;
    console.log("🚀 ~~ otp:", otp);
    const OTP = await Otp.findOne({ mobileNumber });

    if (otp !== OTP.otp) {
      const err = new HttpError("OTP no did not matched", 400);
      return next(err);
    }
    if (mobileNumber !== OTP.mobileNumber) {
      const err = new HttpError("Mobile number no did not matched", 400);
      return next(err);
    }
    const userExists = await User.findOne({ mobileNumber });
    if (userExists) {
      const err = new HttpError("User already exists, try to login", 400);
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
    console.log("🚀 ~ ~ error:", error);
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};
const UserLogin = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    const user = await User.findOne({ mobileNumber: mobileNumber });
    if (!user) {
      const error = new HttpError(
        "No user exists from this mobile no, Sign up",
        400
      );
      return next(error);
    }
    const OTP = generateRandomOTP();
    user.lastOtp = OTP;
    await user.save();
    await client.messages.create({
      body: `Your OTP is: ${OTP}`,
      to: `+91${user.mobileNumber}`,
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
    const { mobileNumber, otp, doNotLogout } = req.body;

    const user = await User.findOne({ mobileNumber: mobileNumber });
    if (!user) {
      const error = new HttpError(
        "No user exists from this mobile no, Sign up",
        400
      );
    }
    // if (otp !== user.lastOtp) {
    //   const err = new HttpError("OTP not matched", 400);
    //   return next(err);
    // }
    const jwtToken = generateUserAuthToken({ id: user.id, mobileNumber });
    let cookieParams = {
      httpOnly: true,
      secure: nodeEnv === "production",
      sameSite: "strict",
    };
    if (doNotLogout) {
      cookieParams = { ...cookieParams, maxAge: cookieMaxAge };
    }

    return res.cookie("UserAccess_token", jwtToken, cookieParams).json({
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

const updateUSerProfile = async (req, res, next) => {
  const { id } = req.user;
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      otherContactNo,
      state,
      address,
      emailAddress,
    } = req.body;
    const user = await User.findById(id);
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.otherContactNo = otherContactNo || user.otherContactNo;
    user.state = state || user.state;
    user.address = address || user.address;
    user.emailAddress = emailAddress || user.emailAddress;
    await user.save();
    console.log("🚀 ~  ~ user:", user);
    res.send("Working");
  } catch (error) {
    const err = new HttpError("unable to update profile", 500);
    return next(error || err);
  }
};
const getUserProfile = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).select('-lastOtp').orFail();
    res.json({message:"Success",user});
  } catch (error) {
    const err = new HttpError("unable fetch user profile", 500);
    return next(error || err);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result  = await User.deleteOne({_id:id})
    if (result.deletedCount === 1) {
      return res.json({ message: "User deleted" });
    } else {
      const err = new HttpError("User not found", 404);
      return next(err);
    }
  } catch (error) {
    const err = new HttpError("Unable to delete user", 500);
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
  updateUSerProfile,
  getUserProfile,
  deleteUser
};

const Doctor = require("../../Models/DoctorModel");

const User = require("../../Models/UserModel");
const HttpError = require("../../Models/http-error");
const { createUserService } = require("../../Services/User/userServices");
const {
  hashPassword,
} = require("../../utils/hashPasswords");
const {checkIfUserExists}=require("../../helpers/helperFunctions")
const UserSignUp = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      mobileNumber,
      otherContactNo,
      state,
      address,
      emailAddress,
      password,
    } = req.body;
    if (
      !(
        firstName &&
        lastName &&
        gender &&
        dateOfBirth &&
        mobileNumber &&
        otherContactNo &&
        state &&
        address &&
        emailAddress &&
        password
      )
    ) {
      throw new HttpError("All input fields are required", 422);
    }
    await checkIfUserExists("User", emailAddress);
    const hashedPassword = await hashPassword(password);

    const user = await createUserService({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      mobileNumber,
      otherContactNo,
      state,
      address,
      emailAddress,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User is Created",
      userCreated: {
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        emailAddress: user.emailAddress,
      },
    });
  } catch (error) {
    const err = new HttpError("Error created while sign up", 400);
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

module.exports = { UserSignUp, doctorsList, selectedDoctorSchedule };

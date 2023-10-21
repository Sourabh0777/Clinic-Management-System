const Doctor = require("../../Models/DoctorModel");
const HttpError = require("../../Models/http-error");
const {
  getDoctorService,
  createDoctorService,
} = require("../../Services/Doctor/DoctorService");
const { nodeEnv } = require("../../config/config");
const { checkIfUserExists } = require("../../helpers/helperFunctions");
const { generateAuthToken } = require("../../utils/generateAuthToken");
const { hashPassword } = require("../../utils/hashPasswords");
const { commonLogin } = require("../common/CommonLogin");
const { commonGetProfile } = require("../common/commonGetProfile");

const doctorSignup = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      specializationID,
      experience,
      rating,
      chargesForOPDExtra,
      emailAddress,
      password,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !experience ||
      !rating ||
      !chargesForOPDExtra ||
      !emailAddress ||
      !password
    ) {
      throw new HttpError("All fields are required", 400);
    }
    const hashedPassword = await hashPassword(password);
    await checkIfUserExists("Doctor", emailAddress);
    const doctor = await createDoctorService({
      firstName,
      lastName,
      mobileNumber,
      specializationID,
      experience,
      rating,
      chargesForOPDExtra,
      emailAddress,
      password: hashedPassword,
    });
    const values = {
      id: doctor.id,
      name: doctor.firstName + " " + doctor.lastName,
      email: doctor.emailAddress,
      operatorType: `${Doctor}`,
      password: doctor.password,
    };
    const jwtToken = generateAuthToken(values);

    return res
      .status(201)
      .cookie("access_token", jwtToken, {
        httpOnly: true,
        secure: nodeEnv === "production",
        sameSite: "strict",
      })
      .json({
        message: "Sign up completed",
        doctor: {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          emailAddress: doctor.emailAddress,
        },
      });
  } catch (error) {
    const err = new HttpError("Error occurred while signing up", 500);
    return next(error || err);
  }
};
const doctorLogin = async (req, res, next) => {
  try {
    const { email, password, doNotLogout } = req.body;
    const loginInput = {
      email,
      password,
      doNotLogout,
      collectionName: `Doctor`,
    };
    const login = await commonLogin(loginInput);
    if (login) {
      const { token, cookieParams, valuesPassInResponse } = login;
      res.cookie("access_token", token, cookieParams).json({
        message: "Success user logged in.",
        user: valuesPassInResponse,
      });
    }
  } catch (error) {
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};
const getDoctorProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const profile = await commonGetProfile(user);
    return res.send(profile);
  } catch (error) {
    const err = new HttpError("Unable to get doctor profile", 500);
    return next(error || err);
  }
};

module.exports = { doctorSignup, doctorLogin, getDoctorProfile };

const Reception = require("../../Models/ReceptionModel");
const HttpError = require("../../Models/http-error");
const Prescription = require("../../Models/PrescriptionModel");
const Appointment = require("../../Models/AppointmentModel");
const User = require("../../Models/UserModel");

const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { hashPassword } = require("../../utils/hashPasswords");
const { createReceptionService } = require("../../Services/Reception/ReceptionServices");

const { nodeEnv, uploadImagePath, uploadPrescriptionPath } = require("../../config/config");
const { generateAuthToken } = require("../../utils/generateAuthToken");
const { checkIfUserExists } = require("../../helpers/helperFunctions");
const { commonLogin } = require("../common/CommonLogin");
const { commonGetProfile } = require("../common/commonGetProfile");
const { pictureValidate } = require("../../utils/pictureValidate");
const { commonGetDoctorList, commonGetDoctorProfile, commonGetDoctorScheduleByScheduleId } = require("../common/CommonDoctor");
const { commonGetAppointmentById } = require("../common/CommonAppointment");
const receptionSignup = async (req, res, next) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;
    if (!(firstName || lastName || !emailAddress || !password)) {
      throw new HttpError("All fields are required", 400);
    }
    await checkIfUserExists("Reception", emailAddress);
    const hashedPassword = await hashPassword(password);
    const receptionist = await createReceptionService({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
    });
    const values = {
      id: receptionist.id,
      name: receptionist.firstName + " " + receptionist.lastName,
      email: receptionist.emailAddress,
      operatorType: `${Reception}`,
      password: receptionist.password,
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
        receptionist: {
          firstName: receptionist.firstName,
          lastName: receptionist.lastName,
          emailAddress: receptionist.emailAddress,
        },
      });
  } catch (error) {
    const err = new HttpError("Error created while sign up", 500);
    return next(error || err);
  }
};
const receptionLogin = async (req, res, next) => {
  try {
    const { email, password, doNotLogout } = req.body;
    const loginInput = {
      email,
      password,
      doNotLogout,
      collectionName: "Reception",
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
const getReceptionProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const profile = await commonGetProfile(user);
    return res.send(profile);
  } catch (error) {
    const err = new HttpError("Unable to get Reception profile", 500);
    return next(error || err);
  }
};
const changeProfilePicture = async (req, res, next) => {
  const uploadImageAbsolutePath = path.resolve(__dirname, uploadImagePath);

  try {
    const user = req.user;
    const picture = req.files.picture;
    console.log("🚀 ~picture:", picture);
    if (!req.files || !!picture === false) {
      const err = new HttpError("No files attached", 400);
      return next(err);
    }
    const validateResult = await pictureValidate(picture);
    if (validateResult.error) {
      const err = new HttpError(validateResult.error, 400);
      return next(err);
    }
    const reception = await Reception.findById(user.id);
    const pictureId = uuidv4();
    const extension = path.extname(picture.name);
    const pictureName = pictureId + extension;
    const uploadPath = uploadImageAbsolutePath + "/" + pictureName;
    picture.mv(uploadPath, function (err) {
      if (err) {
        const err = new HttpError("Unable to upload reports", 500);
        return next(err);
      }
    });
    const profileUrl = "/reception/profile/picture/" + pictureName;
    reception.profilePictureUrl = profileUrl;

    await reception.save();
    res.json({
      message: "File Uploaded",
      reception,
    });
  } catch (error) {
    console.log("🚀 ~ file: receptionController.js:125 ~ changeProfilePicture ~ error:", error);
    const err = new HttpError("Upload profile picture.", 500);
    return next(error || err);
  }
};
const getProfilePicture = async (req, res, next) => {
  try {
    const { pictureId } = req.params;
    const filePath = path.join(__dirname, "../../FilesUploaded/ProfilePictures/" + pictureId);

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      const err = new HttpError("Picture not found", 404);
      return next(err);
    }
    res.send("Working");
  } catch (error) {
    const err = new HttpError("Unable to retrieve the picture", 500);
    return next(error || err);
  }
};

const getDoctorList = async (req, res, next) => {
  try {
    const doctorProfile = await commonGetDoctorList();
    res.json({ message: "Success", doctorProfile });
  } catch (error) {
    const err = new HttpError("Unable fetch doctor list", 500);
    return next(err);
  }
};
const getDoctorProfile = async (req, res, next) => {
  try {
    const doctorProfile = await commonGetDoctorProfile(req.params.id);
    res.json({ message: "Success", doctorProfile });
  } catch (error) {
    const err = new HttpError("Unable find doctor profile", 500);
    return next(err);
  }
};
const getDoctorSchedule = async (req, res, next) => {
  try {
    const schedule = await commonGetDoctorScheduleByScheduleId(req.params.id);
    res.json({ message: "Success", schedule });
  } catch (error) {
    const err = new HttpError("unable to login", 500);
    return next(error || err);
  }
};
const getAppointmentDetails = async (req, res, next) => {
  try {
    const appointment = await commonGetAppointmentById(req.params.id);
    res.json({ message: "Success", appointment });
  } catch (error) {
    const err = new HttpError("Unable to fetch appointment.", 500);
    return next(error || err);
  }
};

const updateVitals = async (req, res, next) => {
  try {
    const { prescriptionId, appointmentId, timeSlotId, reception, vitals, date } = req.body;
    const prescription = await Prescription.findById(prescriptionId);
    prescription.timeSlotId = timeSlotId;
    prescription.reception = reception;
    prescription.date = date;
    prescription.vitals = vitals;
    await prescription.save();
    const appointment = await Appointment.findById(appointmentId);
    appointment.status = "active";
    await appointment.save();
    res.json({ message: "Success", prescription });
  } catch (error) {
    const err = new HttpError("Unable to update vitals.", 500);
    return next(error || err);
  }
};
const getPrescriptionFileById = async (req, res, next) => {
  try {
    const { prescriptionFile } = req.params;
    const filePath = path.join(__dirname, "../../FilesUploaded/Prescriptions/" + prescriptionFile);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      const err = new HttpError("File not found", 404);
      return next(err);
    }
  } catch (error) {
    const err = new HttpError("unable to fetch doctor list", 500);
    throw error || err;
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    appointment.status = "canceled";
    await appointment.save();
    res.json({ message: "Appointment is cancelled", appointment });
  } catch (error) {
    const err = new HttpError("Unable to cancel appointment.", 500);
    return next(error || err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, gender, mobileNumber, emailAddress, dateOfBirth, age } = req.body;
    if (!firstName || !lastName || !dateOfBirth || !mobileNumber || !emailAddress || !age) {
      const err = new HttpError("All input fields are required.", 500);
      return next(err);
    }
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      const err = new HttpError("User with this mobile number already exists.", 422);
      return next(err);
    }
    const user = await User.create({
      firstName,
      lastName,
      gender,
      mobileNumber,
      emailAddress,
      dateOfBirth,
      age,
    });
    return res.json({ message: "Success", user });
  } catch (error) {
    const err = new HttpError("Unable to create user", 500);
    return next(error || err);
  }
};
const searchUser = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    const user = await User.find({ mobileNumber: mobileNumber });
    if (user.length < 1) {
      const err = new HttpError("No user found.", 500);
      return next(err);
    }
    return res.json({ message: "User Found", user });
  } catch (error) {
    const err = new HttpError("Unable to find user.", 500);
    return next(error || err);
  }
};

module.exports = {
  receptionSignup,
  receptionLogin,
  getReceptionProfile,
  changeProfilePicture,
  getProfilePicture,
  getDoctorList,
  getDoctorProfile,
  getDoctorSchedule,
  getAppointmentDetails,
  updateVitals,
  getPrescriptionFileById,
  cancelAppointment,
  createUser,
  searchUser,
};

// const updateVitals = async (req, res, next) => {
//   const uploadFileAbsolutePath = path.resolve(__dirname, uploadPrescriptionPath);
//   try {
//     const { weight , height, bloodPressure, bloodSugar ,priorDisease ,priorMedication   } = req.body;
//     const vitals = { weight , height, bloodPressure, bloodSugar ,priorDisease ,priorMedication   };
//     const prescription = await Prescription.findById(req.params.id);
//     prescription.vitals = vitals;
//     const prescriptionFile = req.files.prescription;
//     if (!req.files || !!prescriptionFile === false) {
//       const err = new HttpError("No files attached", 400);
//       return next(err);
//     }
//     const prescriptionFileId = uuidv4();
//     const extension = path.extname(prescriptionFile.name);
//     const prescriptionFileName = prescriptionFileId + extension;
//     const uploadPath = uploadFileAbsolutePath + "/" + prescriptionFileName;
//     prescriptionFile.mv(uploadPath, function (err) {
//       if (err) {
//         const err = new HttpError("Unable to upload reports", 500);
//         return next(err);
//       }
//     });
//     const prescriptionUrl = "/prescription/" + prescriptionFileName;
//     prescription.prescriptionUrl = prescriptionUrl;
//     const appointmentId = prescription.appointmentId;
//     const appointment = await Appointment.findById(appointmentId);
//     appointment.status = "onGoing";
//     await appointment.save();
//     await prescription.save();
//     res.json({ message: "Success", prescription });
//   } catch (error) {
//     const err = new HttpError("Unable to update vitals.", 500);
//     return next(error || err);
//   }
// };

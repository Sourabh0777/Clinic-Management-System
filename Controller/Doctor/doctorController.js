const Doctor = require("../../Models/DoctorModel");
const HttpError = require("../../Models/http-error");
const ScheduleConfig = require("../../Models/ScheduleConfigModel");
const Prescription = require("../../Models/PrescriptionModel");
const fs = require("fs");
const Appointment = require("../../Models/AppointmentModel");

const path = require("path");
const { v4: uuidv4 } = require("uuid");

const {
   getDoctorService,
   createDoctorService,
} = require("../../Services/Doctor/DoctorService");
const { nodeEnv, uploadImagePath } = require("../../config/config");
const { checkIfUserExists } = require("../../helpers/helperFunctions");
const { generateAuthToken } = require("../../utils/generateAuthToken");
const { hashPassword } = require("../../utils/hashPasswords");
const { commonLogin } = require("../common/CommonLogin");
const { pictureValidate } = require("../../utils/pictureValidate");
const { commonGetAppointmentById } = require("../common/CommonAppointment");
const User = require("../../Models/UserModel");
const {
   getTextMessageInput,
   sendMessage,
} = require("../../utils/meta/whatsapp");

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
         language,
         password,
         education,
         pricePerHour,
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
         language,
         education,
         pricePerHour,
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
         return res.cookie("access_token", token, cookieParams).json({
            message: "User logged in.",
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
      const profile = await Doctor.findById(user.id)
         .populate("specializationID")
         .orFail();
      return res.json({ message: "Success", profile });
   } catch (error) {
      const err = new HttpError("Unable to get doctor profile", 500);
      return next(error || err);
   }
};
const changeProfilePicture = async (req, res, next) => {
   const uploadImageAbsolutePath = path.resolve(__dirname, uploadImagePath);

   try {
      const user = req.user;
      const picture = req.files.picture;
      if (!req.files || !!picture === false) {
         const err = new HttpError("No files attached", 400);
         return next(err);
      }
      const validateResult = await pictureValidate(picture);
      if (validateResult.error) {
         const err = new HttpError(validateResult.error, 400);
         return next(err);
      }
      const doctor = await Doctor.findById(user.id);
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
      const profileUrl = "/doctor/profile/picture/" + pictureName;
      doctor.profilePictureUrl = profileUrl;

      await doctor.save();
      res.json({
         message: "File Uploaded",
         doctor,
      });
   } catch (error) {
      const err = new HttpError("Upload profile picture.", 500);
      return next(error || err);
   }
};
const getProfilePicture = async (req, res, next) => {
   try {
      const { pictureId } = req.params;
      const filePath = path.join(
         __dirname,
         "../../FilesUploaded/ProfilePictures/" + pictureId
      );
      if (fs.existsSync(filePath)) {
         return res.sendFile(filePath);
      } else {
         const err = new HttpError("Picture not found", 404);
         return next(err);
      }
   } catch (error) {
      const err = new HttpError("Unable to retrieve the picture", 500);
      return next(error || err);
   }
};
const getSchedule = async (req, res, next) => {
   try {
      const user = req.user;
      const doctor = await Doctor.findById(user.id);
      const schedule = await ScheduleConfig.findById(
         doctor.scheduleConfigID
      ).orFail();
      return res.json({ message: "Success", schedule });
   } catch (error) {
      const err = new HttpError("Unable to get schedule", 500);
      return next(error || err);
      r;
   }
};
const getAppointment = async (req, res, next) => {
   try {
      const appointment = await commonGetAppointmentById(req.params.id);
      return res.json({ message: "Success", appointment });
   } catch (error) {
      const err = new HttpError("Unable to xasdasd", 500);
      return next(error || err);
   }
};
const getPrescription = async (req, res, next) => {
   try {
      const prescription = await Prescription.findById(req.params.id).orFail();
      return res.json({ message: "Success", prescription });
   } catch (error) {
      const err = new HttpError("Unable to xasdasd", 500);
      return next(error || err);
   }
};
const getAppointments = async (req, res, next) => {
   try {
      const { id } = req.params;
      const appointments = await Appointment.find({ doctor: id })
         .populate("user")
         .populate("doctor")
         .populate("timeSlotId");
      return res.send({ message: "working", appointments });
   } catch (error) {
      const err = new HttpError("Unable to fetch  appointments", 500);
      return next(error || err);
   }
};
const updateVitals = async (req, res, next) => {
   try {
      const { prescriptionId, vitals } = req.body;
      const prescription = await Prescription.findById(prescriptionId);
      prescription.vitals = vitals;
      await prescription.save();
      return res.json({ message: "Vitals Updated", prescription });
   } catch (error) {
      const err = new HttpError("Unable to update vitals.", 500);
      return next(error || err);
   }
};
const updatePrescription = async (req, res, next) => {
   try {
      const { id } = req.params;
      const canvasJson = req.body;
      const prescription = await Prescription.findById(id);
      prescription.prescriptionData = {
         paths: canvasJson,
      };
      await prescription.save();
      return res.json({ message: "Prescription Updated", prescription });
   } catch (error) {
      const err = new HttpError("Unable to update prescription", 500);
      return next(error || err);
   }
};
const completeAppointment = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { nextCheckupDate } = req.body;
      const appointment = await Appointment.findById(id).orFail();
      const user = await User.findById(appointment.user);
      appointment.status = "completed";
      appointment.nextCheckupDate = nextCheckupDate;
      //Whatsapp Message Functionality Goes HERE
      const date = new Date(nextCheckupDate);
      const formatedNextCheckupDate = date.toLocaleString("en-IN", {
         dateStyle: "long",
      });
      const data = getTextMessageInput(
         "919807362721",
         user.firstName,
         formatedNextCheckupDate
      );
      await appointment.save();
      sendMessage(data);
      return res.json({ message: "Appointment Completed", appointment });
   } catch (error) {
      const err = new HttpError("Unable to update appointment", 500);
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
const createUser = async (req, res, next) => {
   try {
      const {
         firstName,
         lastName,
         gender,
         mobileNumber,
         emailAddress,
         dateOfBirth,
         age,
      } = req.body;
      if (
         !firstName ||
         !lastName ||
         !dateOfBirth ||
         !mobileNumber ||
         !emailAddress ||
         !age
      ) {
         const err = new HttpError("All input fields are required.", 500);
         return next(err);
      }
      const existingUser = await User.findOne({ mobileNumber });
      if (existingUser) {
         const err = new HttpError(
            "User with this mobile number already exists.",
            422
         );
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
const UpdateDoctorProfile = async (req, res, next) => {
   try {
      const user = req.user;
      const {
         firstName,
         lastName,
         mobileNumber,
         chargesForOPDExtra,
         emailAddress,
         education,
         experience,
      } = req.body;

      const updateData = {
         firstName,
         lastName,
         mobileNumber,
         chargesForOPDExtra,
         emailAddress,
         education,
         experience,
      };
      console.log("🚀 ~ UpdateDoctorProfile ~ updateData:", updateData);
      const updatedDoctor = await Doctor.findOneAndUpdate(
         { _id: user.id },
         updateData,
         {
            new: true,
            runValidators: true,
         }
      );

      if (!updatedDoctor) {
         throw new HttpError("Doctor not found", 404);
      }

      return res.json({ message: "Profile Updated", updatedDoctor });
   } catch (error) {
      const err = new HttpError("Unable to update doctor profile", 500);
      return next(error || err);
   }
};
module.exports = {
   doctorSignup,
   doctorLogin,
   getDoctorProfile,
   changeProfilePicture,
   getProfilePicture,
   getSchedule,
   getAppointment,
   getPrescription,
   getAppointments,
   updateVitals,
   updatePrescription,
   completeAppointment,
   searchUser,
   createUser,
   UpdateDoctorProfile,
};

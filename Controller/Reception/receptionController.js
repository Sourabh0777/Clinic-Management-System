const Reception = require("../../Models/ReceptionModel");
const HttpError = require("../../Models/http-error");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { hashPassword, comparePassword } = require("../../utils/hashPasswords");
const {
  createReceptionService,
} = require("../../Services/Reception/ReceptionServices");
const { nodeEnv, uploadImagePath } = require("../../config/config");
const { generateAuthToken } = require("../../utils/generateAuthToken");
const { checkIfUserExists } = require("../../helpers/helperFunctions");
const { commonLogin } = require("../common/CommonLogin");
const { commonGetProfile } = require("../common/commonGetProfile");
const { pictureValidate } = require("../../utils/pictureValidate");
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
    console.log("🚀 ~  picture:", picture)
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
    console.log("🚀 ~ file: receptionController.js:125 ~ changeProfilePicture ~ error:", error)
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
    console.log("🚀 ~ file: receptionController.js:138 ~ getProfilePicture ~ filePath:", filePath)
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
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
module.exports = {
  receptionSignup,
  receptionLogin,
  getReceptionProfile,
  changeProfilePicture,
  getProfilePicture,
};

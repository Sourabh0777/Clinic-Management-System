const passwordValidator =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[0-9]).{8,}$/;
const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
const url = process.env.MONGO_URL;
const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV;
const secretKey = process.env.JWT_SECRET_KEY;
const twilioSid = process.env.TWILIOSID;
const twilioAuthToken = process.env.TWILIOAUTHTOKEN;
const jwtExpiresIn = { expiresIn: "7h" };
const cookieMaxAge = 1000 * 60 * 60 * 24 * 7;
const uploadReportsDirectoryPath = "../../FilesUploaded/LabReports";
const uploadImagePath = "../../FilesUploaded/ProfilePictures";
const baseUrl = "http://localhost:5000/"; // Replace with your server's address
const twilioNo = process.env.TWILION;
module.exports = {
  url,
  port,
  passwordValidator,
  timeRegex,
  nodeEnv,
  secretKey,
  jwtExpiresIn,
  cookieMaxAge,
  uploadReportsDirectoryPath,
  baseUrl,
  uploadImagePath,
  twilioSid,
  twilioAuthToken,
  twilioNo,
};

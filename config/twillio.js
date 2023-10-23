function generateRandomOTP() {
  // Generate a random number between 100000 and 999999 (6 digits)
  const min = 100000;
  const max = 999999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString(); // Convert the OTP to a string
}
module.exports = {generateRandomOTP};

const mongoose = require("mongoose")
const OtpSchema = new mongoose.Schema({
    otp :{type:Number,unique: true, required:true},
    mobileNumber:{type:Number, required:true}
},{ timestamps: true })
const Otp = mongoose.model("Otp",OtpSchema);
module.exports = Otp;
//Short hand 
// otp mobileNumber
const Doctor  = require("../../Models/DoctorModel")
const HttpError = require("../../Models/http-error");
const ScheduleConfig = require("../../Models/ScheduleConfigModel")

//Functions
const commonGetDoctorList = async (req, res, next) => {
    try {
      const doctorList = await Doctor.find({}, "firstName lastName scheduleConfigID");
      return doctorList
    } catch (error) {
      const err = new HttpError("unable to fetch doctor list", 500);
      throw error || err
    }
  };
  const commonGetDoctorProfile = async (id) => {
    try {
      const doctorProfile = await Doctor.findById(id);
      return doctorProfile
    } catch (error) {
      const err = new HttpError("unable to fetch doctor details", 500);
      throw error || err
    }
  };
  const commonGetDoctorScheduleByScheduleId = async (id) => {
    try {
      const schedule = await ScheduleConfig.findById(id);
      return schedule
    } catch (error) {
      const err = new HttpError("unable to fetch doctor schedule", 500);
      throw error || err
    }
  };
  module.exports = {commonGetDoctorList,commonGetDoctorProfile,commonGetDoctorScheduleByScheduleId}
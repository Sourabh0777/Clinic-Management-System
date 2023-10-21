const moment = require("moment");
const Doctor = require("../../Models/DoctorModel");
const ScheduleConfig = require("../../Models/ScheduleConfigModel");

const createInitialSchedule = async (req, res, next) => {
  const inputFormat = "hh:mm A";
  const outputFormat = "YYYY-MM-DDTHH:mm:ss.SSS";

  try {
    const doctorId = req.user.id;
    let { workingDays, startTime, endTime, slotDuration } = req.body;

    if (!doctorId || !workingDays || !startTime || !endTime || !slotDuration) {
      return res.status(400).json({ error: "Invalid input data" });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Parse and format the start and end times
    const formatStartTime = moment(startTime, inputFormat).format(outputFormat);
    const formatEndTime = moment(endTime, inputFormat).format(outputFormat);

    const currentDate = new Date();
    let availability = [];
    for (let i = 0; i < workingDays.length; i++) {
      const dayOfWeek = workingDays[i];

      // Find the next occurrence of the specified day
      while (
        currentDate.toLocaleString("en-us", { weekday: "long" }) !== dayOfWeek
      ) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // Create a date object with the correct date and time
      const startDateAndTime = moment(currentDate)
        .set("hour", moment(formatStartTime).hour())
        .set("minute", moment(formatStartTime).minute())
        .set("second", moment(formatStartTime).second())
        .set("millisecond", moment(formatStartTime).millisecond())
        .format(outputFormat);

      const endDateAndTime = moment(currentDate)
        .set("hour", moment(formatEndTime).hour())
        .set("minute", moment(formatEndTime).minute())
        .set("second", moment(formatEndTime).second())
        .set("millisecond", moment(formatEndTime).millisecond())
        .format(outputFormat);

      // Store the start and end times in your availability array or do further processing as needed
      const currentTimeAndDate = moment(startDateAndTime);
      const slotEndTimeAndDate = moment(endDateAndTime);
      const changeCurrentTimeAndDate = moment(startDateAndTime);

      let timeSlots = [];

      while (changeCurrentTimeAndDate < slotEndTimeAndDate) {
        const updatedTimeAndDate = moment(currentTimeAndDate);
        const slotEndTime = currentTimeAndDate.add(30, "minutes");

        // Convert slotEndTime and updatedTimeAndDate to the desired format
        const slotEnd = moment(slotEndTime).format(outputFormat);
        const currentTime = moment(updatedTimeAndDate).format(outputFormat);

        timeSlots.push({
          slotStartTime: currentTime,
          slotEndTime: slotEnd,
          status: "available",
          appointmentID: null,
        });
        // Update changeCurrentTimeAndDate for the next iteration
        changeCurrentTimeAndDate.add(30, "minutes");
      }

      availability.push({
        date: changeCurrentTimeAndDate.format(outputFormat),
        timeSlots,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const scheduleConfig = new ScheduleConfig({
      doctorID: doctor._id,
      workingDays,
      startTime,
      endTime,
      slotDuration,
      availability,
    });
    if (scheduleConfig.id) {
      doctor.scheduleConfigID = scheduleConfig._id;
      await doctor.save()
    }
    await scheduleConfig.save();
    return res.status(201).json({
      message: "Initial schedule created for the doctor",
      scheduleConfig,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createInitialSchedule };

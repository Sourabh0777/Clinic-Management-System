const moment = require("moment");
const Doctor = require("../../Models/DoctorModel");
const ScheduleConfig = require("../../Models/ScheduleConfigModel");
const TimeSlot = require("../../Models/TimeSlotModel");

const createInitialSchedule = async (req, res, next) => {
  const inputFormat = "hh:mm A";
  const outputFormat = "YYYY-MM-DDTHH:mm:ss.SSS";

  try {
    //Checked
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

    //Code to be corrected

    const currentDate = new Date();
    const todaysDayOfWeek = currentDate.toLocaleString("en-us", {
      weekday: "long",
    });
    let upcoming30Dates = [];
    let next30WorkingDates = [];
    for (let i = 0; i < workingDays.length; i++) {
      const dayOfWeek = workingDays[i];
      //Start
      if (todaysDayOfWeek == dayOfWeek) {
        for (let j = 0; j < 30; j++) {
          currentDate.setDate(currentDate.getDate() + 1);
          const upcomingDate = new Date(currentDate);
          upcoming30Dates.push(upcomingDate);
        }
      }
    }
    for (let i = 0; i < upcoming30Dates.length; i++) {
      for (let j = 0; j < workingDays.length; j++) {
        if (
          upcoming30Dates[i].toLocaleString("en-us", { weekday: "long" }) ==
          workingDays[j]
        ) {
          const startDateAndTime = new Date(
            moment(upcoming30Dates[i])
              .set("hour", moment(formatStartTime).hour())
              .set("minute", moment(formatStartTime).minute())
              .set("second", moment(formatStartTime).second())
              .set("millisecond", moment(formatStartTime).millisecond())
              .format(outputFormat)
          );
          const endDateAndTime = new Date(
            moment(upcoming30Dates[i])
              .set("hour", moment(formatEndTime).hour())
              .set("minute", moment(formatEndTime).minute())
              .set("second", moment(formatEndTime).second())
              .set("millisecond", moment(formatEndTime).millisecond())
              .format(outputFormat)
          );
          next30WorkingDates.push({ startDateAndTime, endDateAndTime });
        }
      }
    }
    let availability = [];

    for (let i = 0; i < next30WorkingDates.length; i++) {
      let timeSlots = [];

      const currentTimeAndDate = moment(next30WorkingDates[i].startDateAndTime);
      const slotEndTimeAndDate = moment(next30WorkingDates[i].endDateAndTime);
      const changeCurrentTimeAndDate = moment(
        next30WorkingDates[i].startDateAndTime
      );
      while (changeCurrentTimeAndDate < slotEndTimeAndDate) {
        const updatedTimeAndDate = moment(currentTimeAndDate);
        const slotEndTime = currentTimeAndDate.add(30, "minutes"); // First slot end time

        // Convert slotEndTime and updatedTimeAndDate to the desired format
        const slotEnd = moment(slotEndTime).format(outputFormat); // Change format for the slot end time
        const currentTime = moment(updatedTimeAndDate).format(outputFormat);
        const timeSlot = await TimeSlot.create({
          slotStartTime: currentTime,
          slotEndTime: slotEnd,
          status: "available",
          appointmentID: null,
        });
        timeSlots.push(timeSlot._id);
        // Update changeCurrentTimeAndDate for the next iteration
        changeCurrentTimeAndDate.add(30, "minutes");
      }
      availability.push({
        date: changeCurrentTimeAndDate.format(outputFormat),
        timeSlots
      });

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

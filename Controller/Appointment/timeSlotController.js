const TimeSlot = require("../../Models/TimeSlotModel");
const getTimeSlotDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timeSlot = await TimeSlot.findById(id);
    if (!timeSlot) {
      const err = new HttpError("No time slot was found by this id.", 500);
    }
    return res.send(timeSlot);
  } catch (error) {
    const err = new HttpError("Unable to find time slot details", 500);
    return next(error || err);
  }
};
module.exports = { getTimeSlotDetails };

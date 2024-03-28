const TimeSlot = require('../../Models/TimeSlotModel');
const HttpError = require('../../Models/http-error');
const getTimeSlotDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timeSlot = await TimeSlot.findById(id);
    if (!timeSlot) {
      const err = new HttpError('No time slot was found by this id.', 500);
      throw err;
    }
    return res.send(timeSlot);
  } catch (error) {
    const err = new HttpError('Unable to find time slot details', 500);
    return next(err);
  }
};
module.exports = { getTimeSlotDetails };

const Appointment = require("../../Models/AppointmentModel");
const Prescription = require("../../Models/PrescriptionModel");
const ScheduleConfig = require("../../Models/ScheduleConfigModel");
const HttpError = require("../../Models/http-error");
const mongoose = require("mongoose");

const createAppointment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      user,
      doctor,
      reception,
      modeOfAppointment,
      appointmentDate,
      timeSlot,
      appointmentType,
      status,
      consultationFee,
      paymentStatus,
      paymentMethod,
      totalAmount,
      appointmentNotes,
      nextCheckupDate,
    } = req.body;

    if (!(user && doctor && appointmentDate && timeSlot && appointmentType)) {
      throw new HttpError("All input fields are required", 422);
    }

    const prescriptionId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for prescription
    const appointmentId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for prescription

    const appointment = await Appointment.create({
      _id: appointmentId,
      user,
      doctor,
      reception,
      prescription: prescriptionId,
      modeOfAppointment,
      appointmentDate,
      timeSlot,
      appointmentType,
      status,
      consultationFee,
      paymentStatus,
      paymentMethod,
      totalAmount,
      appointmentNotes,
      nextCheckupDate,
    });

    // Now create the Prescription with additional data
    const prescription = await Prescription.create({
      _id: prescriptionId,
      date: appointmentDate,
      user: user,
      appointmentId: appointment._id, // Update the appointmentId in Prescription
    });

    const scheduleConfig = await ScheduleConfig.findOne({
      "availability.timeSlots._id": timeSlot,
    }).orFail();
    const timeSlotIndex = scheduleConfig.availability
      .flatMap((availabilitySlot) => availabilitySlot.timeSlots)
      .findIndex((ts) => ts._id.toString() === timeSlot);

    if (timeSlotIndex !== -1) {
      // Update the `ts` object with the appointment ID and status
      scheduleConfig.availability.flatMap(
        (availabilitySlot) => availabilitySlot.timeSlots
      )[timeSlotIndex].appointmentID = appointmentId;
      scheduleConfig.availability.flatMap(
        (availabilitySlot) => availabilitySlot.timeSlots
      )[timeSlotIndex].status = "booked";

      // Save the updated `scheduleConfig` to persist the changes
      await scheduleConfig.save();
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "success",
      appointment: appointment,
      prescription: prescription,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    const err = new HttpError("Error creating appointment", 400);
    return next(error || err);
  }
};

module.exports = { createAppointment };

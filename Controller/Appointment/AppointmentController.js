const Appointment = require("../../Models/AppointmentModel");
const Prescription = require("../../Models/PrescriptionModel");
const ScheduleConfig = require("../../Models/ScheduleConfigModel");
const TimeSlot = require("../../Models/TimeSlotModel");
const HttpError = require("../../Models/http-error");
const mongoose = require("mongoose");
const schedule = require("node-schedule");

const createAppointment = async (req, res, next) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      const {
         user,
         doctor,
         reception,
         appointmentDate,
         timeSlotId,
         appointmentType,
         status,
         consultationFee,
         paymentStatus,
         paymentMethod,
         totalAmount,
         appointmentNotes,
         nextCheckupDate,
      } = req.body;

      if (
         !(user && doctor && appointmentDate && timeSlotId && appointmentType)
      ) {
         throw new HttpError("All input fields are required", 422);
      }

      const prescriptionId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for prescription
      const appointmentId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for appointment

      const appointment = await Appointment.create({
         _id: appointmentId,
         user,
         doctor,
         reception,
         prescription: prescriptionId,
         appointmentDate,
         timeSlotId,
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
      const timeSlot = await TimeSlot.findById(timeSlotId);
      if (!timeSlot) {
         const err = new HttpError("No time slot found", 400);
         session.abortTransaction();
         return next(err);
      }
      timeSlot.status = "booked";
      timeSlot.appointmentID = appointmentId;
      await timeSlot.save();
      //TODO:Schedule WhatsApp Message Testing
      const date = new Date(timeSlot.slotStartTime);
      // Subtract 2 days
      date.setDate(date.getDate() - 1);
      console.log("1 day back date:", date);
      schedule.scheduleJob(date, () => {
         console.log("Schedule Job is Working");
      });

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
const UpdateAppointment = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await Appointment.findById(id);
      appointment.status = status;
      await appointment.save();
      return res.json({ message: "Appointment status updated." });
   } catch (error) {
      const err = new HttpError("Unable to appointment status.", 500);
      return next(error || err);
   }
};
const getAcceptedAppointments = async (req, res, next) => {
   try {
      const appointments = await Appointment.find({
         $or: [{ status: "accepted" }, { paymentMethod: "Paid" }],
      })
         .populate("doctor")
         .populate("timeSlotId")
         .populate("user");

      return res.json({ message: "Success", appointments });
   } catch (error) {
      const err = new HttpError("Unable to xasdasd", 500);
      return next(error || err);
   }
};
module.exports = {
   createAppointment,
   UpdateAppointment,
   getAcceptedAppointments,
};

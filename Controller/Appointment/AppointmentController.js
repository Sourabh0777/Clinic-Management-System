const Appointment = require("../../Models/AppointmentModel");
const Prescription = require("../../Models/PrescriptionModel");
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
         appointmentDate,
         appointmentType,
         status,
         paymentStatus,
         paymentMethod,
         totalAmount,
         appointmentNotes,
         nextCheckupDate,
      } = req.body;

      if (!(user && doctor && appointmentDate && appointmentType)) {
         throw new HttpError("All input fields are required", 422);
      }
      // Generate a new ObjectId for prescription
      const prescriptionId = new mongoose.Types.ObjectId();
      // Generate a new ObjectId for appointment
      const appointmentId = new mongoose.Types.ObjectId();

      const appointment = await Appointment.create({
         _id: appointmentId,
         user,
         doctor,
         reception,
         prescription: prescriptionId,
         appointmentDate,
         appointmentType,
         status,
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
         .populate("user");

      return res.json({ message: "Success", appointments });
   } catch (error) {
      const err = new HttpError("Unable to fetch accepted appointments", 500);
      return next(error || err);
   }
};
module.exports = {
   createAppointment,
   UpdateAppointment,
   getAcceptedAppointments,
};

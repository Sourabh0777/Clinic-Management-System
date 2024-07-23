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

      // Convert appointmentDate to required format
      const date = new Date(appointmentDate);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // month is 0-indexed
      const day = ("0" + date.getDate()).slice(-2);

      // Generate custom appointment ID
      const datePrefix = `${year}${month}${day}`;
      let nextNumber = 1;

      // Fetch the latest appointment with the same date prefix
      const latestAppointment = await Appointment.findOne({
         appointmentId: new RegExp(`^${datePrefix}`),
      })
         .sort({ appointmentId: -1 })
         .exec();

      if (latestAppointment) {
         const latestId = latestAppointment.appointmentId;
         const latestNumber = parseInt(latestId.slice(8)); // Get the numeric part
         nextNumber = latestNumber + 1;
      }

      const appointmentId = `${datePrefix}${("000" + nextNumber).slice(-4)}`; // Pad the number to ensure it is 4 digits

      // Generate a new ObjectId for prescription
      const prescriptionId = new mongoose.Types.ObjectId();

      const appointment = await Appointment.create({
         _id: new mongoose.Types.ObjectId(),
         appointmentId, // Custom appointment ID
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

      // Populate user and doctor details
      const populatedAppointment = await Appointment.findById(appointment._id)
         .populate("user")
         .populate("doctor")
         .exec();

      res.status(201).json({
         message: "success",
         appointment: populatedAppointment,
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

const getUserPastAppointments = async (req, res) => {
   try {
      const userId = req.params.userId;
      const pastAppointments = await Appointment.find({
         user: userId,
         status: "completed",
      });

      if (!pastAppointments || pastAppointments.length === 0) {
         return res.status(404).json({
            success: false,
            message: "No past appointments found for this user.",
         });
      }

      return res.status(200).json({
         success: true,
         appointments: pastAppointments,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         message: "Error while fetching past appointments",
      });
   }
};
module.exports = {
   createAppointment,
   UpdateAppointment,
   getAcceptedAppointments,
   getUserPastAppointments,
};

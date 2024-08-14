const express = require("express");
const routers = express();
const userRoutes = require("./user.routes");
const doctorRoutes = require("./doctor.routes");
const staffRoutes = require("./staff.routes");
const appointmentRoutes = require("./appointment.routes");
const labReportsRoutes = require("./labReports.routes");
const prescriptionRoutes = require("./prescription.routes");

routers.use("/user", userRoutes);
routers.use("/doctor", doctorRoutes);
routers.use("/staff", staffRoutes);
routers.use("/appointment", appointmentRoutes);
routers.use("/lab", labReportsRoutes);
routers.use("/prescription", prescriptionRoutes);

module.exports = routers;

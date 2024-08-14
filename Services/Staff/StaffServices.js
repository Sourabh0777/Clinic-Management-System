const Staff = require("../../Models/StaffModel");

const createstaffService = async (data) => {
   const staff = await Staff.create(data);
   return staff;
};

module.exports = { createstaffService };

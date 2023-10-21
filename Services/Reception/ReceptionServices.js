const Reception = require("../../Models/ReceptionModel");

const createReceptionService = async (data) => {
  const reception = await Reception.create(data);
  return reception;
};

module.exports = { createReceptionService };

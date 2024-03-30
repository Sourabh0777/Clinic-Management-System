const express = require('express');
const cors = require('cors');

const routes = require('./Routes/api.routes');
const HttpError = require('./Models/http-error');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.use(cors());
//remove later whatsapp
const { sendMessage, getTextMessageInput } = require('./utils/meta/whatsapp');

require('dotenv').config();
app.post('/whatsappTesting', function (req, res, next) {
  console.log('working');
  const recipientNumber = '917042987761';
  const baseMessage = 'Hi {{1}}, Just following up on our appointment on {{2}}. Hope everything went well!';
  const patientName = 'John Doe';
  const appointmentDate = '2024-04-05'; // Format the date as YYYY-MM-DD

  var data = getTextMessageInput(recipientNumber, baseMessage, patientName, appointmentDate);

  sendMessage(data)
    .then(function (response) {
      return res.send('Message sent successfully');
    })
    .catch(function (error) {
      console.log(error);
      return res.send('Error sending message:');
    });
});
//remove later
app.use('/', routes);
app.use((req, res, next) => {
  const error = new HttpError('Unknown Route', 404);
  throw error;
});
app.use((error, req, res, next) => {
  if (res.headerSent == true) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || 'Unknown error occurred' });
});
module.exports = app;

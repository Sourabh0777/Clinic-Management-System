const axios = require('axios');
require('dotenv').config();

async function sendMessage(data) {
  try {
    const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`;
    const config = {
      method: 'post',
      url,
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data,
    };
    const response = await axios(config);
    console.log('🚀 ~ sendMessage ~ response:', response);
    return response;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error; // Re-throw the error for potential handling in your application
  }
}

function getTextMessageInput(recipientNumber, patientName, appointmentDate) {
  return JSON.stringify({
    messaging_product: 'whatsapp',
    to: recipientNumber,
    type: 'template',
    template: {
      name: 'appointment1',
      language: {
        code: 'en_US',
        policy: 'deterministic',
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: patientName,
            },
            {
              type: 'text',
              text: appointmentDate,
            },
          ],
        },
      ],
    },
  });
}

module.exports = {
  sendMessage,
  getTextMessageInput,
};

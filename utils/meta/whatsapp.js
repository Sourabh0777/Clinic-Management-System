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

function getTextMessageInput(recipientNumber, baseMessage, patientName, appointmentDate) {
  const formattedText = baseMessage.replace('{{1}}', patientName).replace('{{2}}', appointmentDate);
  console.log('🚀 ~ getTextMessageInput ~ formattedText:', formattedText);

  return JSON.stringify({
    messaging_product: 'whatsapp',
    to: recipientNumber,
    type: 'template',
    template: {
      name: 'next_appointment_date',
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
              text: '1',
            },
            {
              type: 'text',
              text: '2',
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

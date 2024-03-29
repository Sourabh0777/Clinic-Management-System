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

function getTextMessageInput(recipient, text) {
  console.log('🚀 ~ getTextMessageInput ~ recipient:', recipient);
  console.log('getTextMessageInput executed');
  return JSON.stringify({
    messaging_product: 'whatsapp',
    to: recipient,
    type: 'template',
    template: {
      name: 'hello_world',
      language: {
        code: 'en_US',
      },
    },
  });
}

module.exports = {
  sendMessage,
  getTextMessageInput,
};

'use strict';

const whatsappNumber = process.env.ADMIN_WHATSAPP_NUMBER || '+2349071809866';
const apiConfig = {
    apiKey: process.env.API_KEY,
    apiUrl: process.env.API_URL
};

function sendWhatsAppMessage(message) {
    if (!message) {
        throw new Error('Message content is required.');
    }
    // Logic to send message using the WhatsApp API
    return {
        success: true,
        message: 'Message sent successfully',
        number: whatsappNumber
    };
}

module.exports = { sendWhatsAppMessage };
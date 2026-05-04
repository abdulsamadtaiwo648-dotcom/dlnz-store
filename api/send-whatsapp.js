const axios = require('axios');

const ADMIN_WHATSAPP_NUMBER = '+2349071809866';
const WHATSAPP_PHONE_NUMBER_ID = '963243623542229';

const sendWhatsAppMessage = async (phoneNumber, message) => {
    const baseUrl = process.env.WHATSAPP_API_BASE_URL || 'https://graph.instagram.com/v18.0';
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumber || !message) {
        throw new Error('Phone number and message are required');
    }

    if (!token) {
        throw new Error('WhatsApp Access Token not configured in environment variables');
    }

    const url = `${baseUrl}/${phoneNumberId}/messages`;

    const payload = {
        messaging_product: 'whatsapp',
        to: phoneNumber.replace(/\D/g, ''),
        type: 'text',
        text: { body: message },
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Message sent successfully:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        console.error('Error sending message:', errorMessage);
        return { success: false, error: errorMessage };
    }
};

const sendToAdmin = async (message) => {
    return sendWhatsAppMessage(ADMIN_WHATSAPP_NUMBER, message);
};

module.exports = { sendWhatsAppMessage, sendToAdmin, ADMIN_WHATSAPP_NUMBER, WHATSAPP_PHONE_NUMBER_ID };
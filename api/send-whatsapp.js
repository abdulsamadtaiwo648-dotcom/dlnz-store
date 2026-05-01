const axios = require('axios');

const sendWhatsAppMessage = async (phoneNumber, message) => {
    const url = `https://your-whatsapp-business-api-endpoint/v1/messages`;
    const token = 'YOUR_ACCESS_TOKEN'; // Replace with your actual token

    const payload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
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
        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};

// Export the function for use in other modules
module.exports = sendWhatsAppMessage;
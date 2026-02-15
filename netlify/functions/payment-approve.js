const axios = require('axios');

exports.handler = async (event) => {
    // إعدادات الوصول للسماح لمتصفح Pi بالاتصال
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    // التعامل مع طلبات Preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: "Method Not Allowed" };
    }

    try {
        const { paymentId } = JSON.parse(event.body);

        // تصحيح الرابط وإضافة الترويسات بشكل كامل
        const response = await axios.post(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {}, {
            headers: { 'Authorization': `Key ${process.env.PI_API_KEY}` }
        });

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify(response.data) 
        };
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify(error.response?.data || error.message) 
        };
    }
};


const axios = require('axios');

exports.handler = async (event) => {
    // إعدادات الوصول للسماح لمتصفح Pi بالاتصال
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers };
    }

    try {
        // استقبال المعرف والـ txid من الواجهة الأمامية
        const { paymentId, txid } = JSON.parse(event.body);

        // إرسال طلب الإكمال النهائي لشبكة Pi
        const response = await axios.post(`https://api.minepi.com/v2/payments/${paymentId}/complete`, 
        { txid }, 
        {
            headers: { 'Authorization': `Key ${process.env.PI_API_KEY}` }
        });

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify(response.data) 
        };
    } catch (error) {
        console.error("Complete Error:", error.response?.data || error.message);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify(error.response?.data || error.message) 
        };
    }
};


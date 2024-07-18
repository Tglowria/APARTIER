const axios = require ('axios');
const dotenv = require('dotenv');


dotenv.config();

const flutterwaveBaseUrl = 'https://api.flutterwave.com/v3';
const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;

const processPaymentWithFlutterwave = async (amount, currency, paymentOptions, customer, redirectUrl, userId, shortletId) => {
    try {
        const txRef = `hooli-tx-${Date.now()}`;
        const response = await axios.post(
            `${flutterwaveBaseUrl}/payments`,
            {
                tx_ref: txRef,
                amount,
                currency,
                payment_options: paymentOptions,
                redirect_url: redirectUrl,
                customer,
                customizations: {
                    title: 'Apartier Payment',
                    description: 'Payment for booking a shortlet apartment',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${flutterwaveSecretKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const payment = await Payment.create({
            txRef,
            amount,
            currency,
            status: response.data.status,
            userId,
            shortletId,
            paymentLink: response.data.data.link,
        });

        return response.data;
    } catch (error) {
        console.error('Payment processing error:', error.response.data);
        throw new Error('Payment processing failed');
    }
};

module.exports = { processPaymentWithFlutterwave };

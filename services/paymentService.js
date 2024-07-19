const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const processPayment = async (paymentDetails) => {
  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: `tx-${Date.now()}`,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        redirect_url: 'https://your-redirect-url.com/success', // Replace with your actual redirect URL
        customer: {
          email: paymentDetails.email,
          name: paymentDetails.fullname,
          phonenumber: paymentDetails.phone_number
        },
        customizations: {
          title: 'Shortlet Booking Payment'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response ? err.response.data : err.message);
  }
};

module.exports = { processPayment };

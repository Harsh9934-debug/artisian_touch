const Razorpay = require("razorpay");

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.error(
        "RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Payment functionality will be disabled."
    );

    
}

module.exports = razorpayInstance;

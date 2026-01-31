const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const makeAdmin = async (email) => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mern-ecommerce";
        await mongoose.connect(mongoUri);
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: "admin" },
            { new: true }
        );

        if (user) {
            console.log(`Successfully promoted ${email} to admin.`);
        } else {
            console.log(`User with email ${email} not found.`);
        }
    } catch (error) {
        console.error("Error updating user role:", error);
    } finally {
        mongoose.connection.close();
    }
};

const email = process.argv[2];
if (!email) {
    console.log("Please provide an email address as an argument.");
    console.log("Example: node makeAdmin.js test@example.com");
} else {
    makeAdmin(email);
}

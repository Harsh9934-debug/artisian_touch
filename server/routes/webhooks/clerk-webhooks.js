const express = require("express");
const { Webhook } = require("svix");
const User = require("../../models/User");

const router = express.Router();

// Clerk Webhook Secret from dashboard
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

router.post("/clerk", express.raw({ type: 'application/json' }), async (req, res) => {
    if (!webhookSecret) {
        console.error("Missing CLERK_WEBHOOK_SECRET in environment");
        return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const payload = req.body;
    const headers = req.headers;

    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ success: false, message: "Missing Svix headers" });
    }

    const wh = new Webhook(webhookSecret);
    let evt;

    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Webhook signature verification failed.", err);
        return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const { id, type } = evt;

    if (type === "user.created") {
        const { id: clerkId, email_addresses, username, first_name, last_name } = evt.data;

        const email = email_addresses && email_addresses[0]?.email_address;
        const name = username || `${first_name} ${last_name}`.trim() || "New User";

        try {
            // Create user locally in MongoDB
            // Clerk passes unique ids, so we save that as the `_id` bypass or we just save a mapping.
            // Easiest is to save it as a dedicated clerkId field, or alter the User model lightly to allow dynamic passwords since Clerk handles passwords.

            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                const newUser = new User({
                    userName: name,
                    email: email,
                    password: clerkId, // Use Clerk ID as placeholder password since auth is decoupled
                    role: "user",
                });

                // But remember, our Cart/Wishlist are mapped using String references to Mongoose `userId`. So we can use standard UUID or just let Mongoose build one. However, the Frontend passes the Clerk string ID in `userId: user.id`. Thus, the Mongoose `User` schema shouldn't actually enforce the standard ObjectId if we depend on it, OR we just let it exist silently since the queries are decoupled.

                await newUser.save();
                console.log(`Successfully synced user ${email} to MongoDB`);
            }
        } catch (err) {
            console.error("Error creating user locally via webhook", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }
    }

    return res.status(200).json({ success: true, message: "Webhook received" });
});

module.exports = router;

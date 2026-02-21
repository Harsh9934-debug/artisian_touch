require("dotenv").config();
const { createClerkClient } = require("@clerk/backend");

const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = createClerkClient({ secretKey });

const userId = process.argv[2];

if (!userId) {
    console.log("Usage: node scripts/set-admin.js <CLERK_USER_ID>");
    process.exit(1);
}

async function setAdmin() {
    try {
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "admin",
            },
        });
        console.log(`Successfully set role 'admin' for user: ${userId}`);
    } catch (error) {
        console.error("Error setting admin role:", error);
    }
}

setAdmin();

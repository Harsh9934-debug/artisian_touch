const User = require("../../models/User");

const syncUser = async (req, res) => {
    try {
        const { userId, email, userName } = req.body;

        if (!userId || !email) {
            return res.status(400).json({
                success: false,
                message: "User ID and Email are required",
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                userName: userName || email.split("@")[0],
                email: email,
                password: userId, // Clerk ID acts as a placeholder password
                role: "user",
            });
            await user.save();
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured syncing user",
        });
    }
};

module.exports = { syncUser };

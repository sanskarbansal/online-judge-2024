const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = require("../config");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already present with this email." });

        await User.create({ name, email, password });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, config.secretKey, { expiresIn: "24h" });

        // Send back user data and token
        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            // return res.status(404).json({ error: "User not found." });
            throw new ApiError(404, "User not found!");
        }
        res.json({
            user: { email: user.email, name: user.name },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

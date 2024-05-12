const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user.model");

exports.authenticateToken = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; // Get token from request header
    if (!token) {
        return res.status(401).json({ message: "Authentication token missing" });
    }
    jwt.verify(token, config.secretKey, async (error, decode) => {
        if (error) {
            return res.status(403).json({ message: "Invalid token" });
        }
        const { userId } = decode;
        const user = await User.findById(userId);
        if (!user || user.isActive === false) return res.status(403).json({ message: "User not found!" });
        req.user = user; // Attach the authenticated user's data to the request
        next();
    });
};

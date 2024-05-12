const express = require("express");

const authRouter = require("./auth.route");
const problemRouter = require("./problem.route");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use("/auth", authRouter);
router.use("/problems", authenticateToken, problemRouter);

module.exports = router;

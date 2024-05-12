// db.js
const mongoose = require("mongoose");
const config = require("../config");

mongoose.connect(config.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

db.once("open", () => {
    console.log("Connected to MongoDB");
});

module.exports = db;

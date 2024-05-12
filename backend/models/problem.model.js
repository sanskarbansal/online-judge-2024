const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});
const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;

const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
    problem_id: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    input_file_path: { type: String, required: true }, // Path to input file
    output_file_path: { type: String, required: true }, // Path to output file
});

const TestCase = mongoose.model("TestCase", testCaseSchema);

module.exports = TestCase;

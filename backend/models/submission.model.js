const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem_id: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    language: { type: String, required: true, enum: ["cpp", "python"], default: "cpp" },
    code: { type: String, required: true },
    submission_time: { type: Date, default: Date.now },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;

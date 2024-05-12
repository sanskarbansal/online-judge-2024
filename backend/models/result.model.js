const mongoose = require("mongoose");

const submissionResultSchema = new mongoose.Schema({
    submission_id: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
    test_case_id: { type: mongoose.Schema.Types.ObjectId, ref: "TestCase", required: true },
    status: { type: String, required: true, enum: ["PENDING", "WA", "Accepted", "CE", "RTE"] },
});

const SubmissionResult = mongoose.model("SubmissionResult", submissionResultSchema);

module.exports = SubmissionResult;

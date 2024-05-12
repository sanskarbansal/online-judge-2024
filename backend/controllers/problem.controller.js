const fs = require("fs");
const { promisify } = require("util");

const Problem = require("../models/problem.model"); // Assuming your models are in a folder called 'models'
const Submission = require("../models/submission.model");
const TestCase = require("../models/testcase.model");
const SubmissionResult = require("../models/result.model");
const runTest = require("../utils/runTest");

const writeFileAsync = promisify(fs.writeFile);

exports.createProblem = async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(201).json(problem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createSubmission = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.problemId);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const submission = await Submission.create({
            user_id: req.user.id,
            problem_id: req.params.problemId,
            language: req.body.language,
            code: req.body.code,
        });

        const testCases = await TestCase.find({ problem_id: submission.problem_id });

        // Iterate over test cases and execute submission code
        const results = [];
        for (const testCase of testCases) {
            const result = await runTest(submission, testCase);
            results.push(result);
        }
        await SubmissionResult.insertMany(results);

        res.status(201).json(submission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ problem_id: req.params.problemId, user_id: req.user.id });
        if (!submissions) return res.status(404).json({ error: "Submission not found!" });
        let output = [];
        for (let submission of submissions) {
            const results = await SubmissionResult.find({ submission_id: submission.id }).select("status");
            output.push({ language: submission.language, code: submission.code, submission_time: submission.submission_time, results });
        }
        res.json(output);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.addTestCase = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.problemId);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const { input, output } = req.body;

        const inputFilePath = `./testcases/${problem._id}_${Date.now()}_input.txt`;
        const outputFilePath = `./testcases/${problem._id}_${Date.now()}_output.txt`;

        await Promise.all([writeFileAsync(inputFilePath, input), writeFileAsync(outputFilePath, output)]);

        const testCase = await TestCase.create({
            problem_id: req.params.problemId,
            input_file_path: inputFilePath,
            output_file_path: outputFilePath,
        });

        res.status(201).json(testCase);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

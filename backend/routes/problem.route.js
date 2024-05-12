const express = require("express");
const problemController = require("../controllers/problem.controller");

const router = express.Router();

router.post("/", problemController.createProblem);
router.get("/", problemController.getAllProblems);
router.get("/:id", problemController.getProblemById);
router.post("/:problemId/submissions", problemController.createSubmission);
router.get("/:problemId/submissions", problemController.getAllSubmissions);

// Create a test case for a specific problem
router.post("/:problemId/testcases", problemController.addTestCase);

module.exports = router;

const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

async function runTest(submission, testCase) {
    return new Promise((resolve, reject) => {
        const language = submission.language;
        const code = submission.code;
        const inputFilePath = testCase.input_file_path;
        const outputFilePath = testCase.output_file_path;

        if (language === "cpp") {
            const executablePath = `./temp/${uuidv4()}.out`;

            const tempCodeFilePath = `./temp/${uuidv4()}.cpp`;
            fs.writeFile(tempCodeFilePath, code, (writeError) => {
                if (writeError) {
                    reject(new Error(`Failed to write code to temporary file: ${writeError.message}`));
                    return;
                }

                // Compile user's C++ code
                const compileCommand = `g++-13 -o ${executablePath} ${tempCodeFilePath}`;
                exec(compileCommand, (compileError, compileStdout, compileStderr) => {
                    if (compileError) {
                        resolve({ submission_id: submission._id, test_case_id: testCase._id, status: "CE" });
                        return;
                    }

                    executeCode(
                        "",
                        executablePath,
                        inputFilePath,
                        outputFilePath,
                        (r) => resolve({ ...r, submission_id: submission._id, test_case_id: testCase._id }),
                        reject
                    );
                });
            });
        } else if (language === "python") {
            const tempCodeFilePath = `./temp/${uuidv4()}.py`;
            fs.writeFile(tempCodeFilePath, code, (writeError) => {
                if (writeError) {
                    reject(new Error(`Failed to write code to temporary file: ${writeError.message}`));
                    return;
                }

                // Execute Python code
                executeCode(
                    "python3",
                    tempCodeFilePath,
                    inputFilePath,
                    outputFilePath,
                    (r) => resolve({ ...r, submission_id: submission._id, test_case_id: testCase._id }),
                    reject
                );
            });
        } else {
            reject(new Error(`Unsupported language: ${language}`));
        }
    });
}
function executeCode(executable, codeFile, inputFile, outputFile, resolve, reject) {
    const executeCommand = `${executable} ${codeFile} < ${inputFile}`;
    exec(executeCommand, (executeError, stdout, stderr) => {
        if (executeError) {
            resolve({ status: "RTE" });
            return;
        }

        const expectedOutput = fs.readFileSync(outputFile, "utf8").trim();
        const actualOutput = stdout.trim();

        const status = actualOutput === expectedOutput ? "Accepted" : "WA";

        // Create result object
        const result = {
            status: status,
        };

        resolve(result);
    });
}

module.exports = runTest;

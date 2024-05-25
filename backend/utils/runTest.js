const fs = require("fs");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);
const Docker = require("dockerode");
const { v4: uuidv4 } = require("uuid");

// Docker setup
const docker = new Docker();

// Function to run test case against submission code
async function runTest(submission, testCase) {
    const language = submission.language;
    const code = submission.code;
    const inputFilePath = testCase.input_file_path;
    const outputFilePath = testCase.output_file_path;

    try {
        let executionResult;
        if (language === "cpp") {
            // For C++ code
            executionResult = await runCPP(code, inputFilePath);
        } else if (language === "python") {
            // For Python code
            executionResult = await runPython(code, inputFilePath);
        } else {
            throw new Error(`Unsupported language: ${language}`);
        }

        // Compare output with expected output
        const expectedOutput = await readFileAsync(outputFilePath, "utf8");
        const actualOutput = executionResult.trim();
        const status = actualOutput === expectedOutput.trim() ? "Accepted" : "WA";

        // Create result object
        return {
            status: status,
            // execution_time: executionResult.executionTime,
            // memory_usage: executionResult.memoryUsage,
        };
    } catch (error) {
        throw new Error(`Execution failed: ${error.message}`);
    }
}

// Promisify fs.writeFile
const writeFileAsync = util.promisify(fs.writeFile);
// Promisify fs.readFile
const readFileAsync = util.promisify(fs.readFile);

// Function to run C++ code
async function runCPP(code, inputFilePath) {
    const tempCodeFilePath = `./temp/${uuidv4()}.cpp`;
    await writeFileAsync(tempCodeFilePath, code);

    const dockerImage = "cpp_sandbox"; // Replace with your Docker image for C++ sandbox
    const command = `g++ -o /code.out /code/code.cpp && /code.out < /input/input.txt`;
    return await runDockerContainer(dockerImage, tempCodeFilePath, inputFilePath, command);
}

// Function to run Python code
async function runPython(code, inputFilePath) {
    const tempCodeFilePath = `./temp/${uuidv4()}.py`;
    await writeFileAsync(tempCodeFilePath, code);

    const dockerImage = "python_sandbox"; // Replace with your Docker image for Python sandbox
    const command = `sh -c "python /code/code.py < /input/input.txt"`;
    return await runDockerContainer(dockerImage, tempCodeFilePath, inputFilePath, command);
}

// Function to run Docker container
async function runDockerContainer(image, codeFilePath, inputFilePath, command) {
    const container = await docker.createContainer({
        Image: image,
        Tty: true,
        AttachStdout: true,
        AttachStderr: true,
        HostConfig: {
            AutoRemove: true,
            Binds: [
                `${path.resolve(codeFilePath)}:/code/code.${codeFilePath.split(".").pop()}`, // Mount code file
                `${path.resolve(inputFilePath)}:/input/input.txt`, // Mount input file
            ],
        },
    });
    await container.start();

    const execCommand = await container.exec({
        Cmd: ["sh", "-c", command],
        AttachStdout: true,
        AttachStderr: true,
    });

    const outputStream = await execCommand.start();
    const executionResult = await new Promise((resolve, reject) => {
        let stdout = "";
        let stderr = "";
        outputStream.on("data", (data) => {
            stdout += Buffer.from(data).toString();
        });

        outputStream.on("error", (error) => {
            stderr += error.toString();
            console.log(stderr);
        });

        outputStream.on("end", () => {
            if (stderr) {
                console.log(stderr);
                reject(new Error(`Execution error: ${stderr}`));
            } else {
                // console.log(stdout);

                const cleanedOutput = stdout.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

                resolve(cleanedOutput);
            }
        });
    });
    await container.stop();
    // await container.remove();
    return executionResult;
}

module.exports = runTest;

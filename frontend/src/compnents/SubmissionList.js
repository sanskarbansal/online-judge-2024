// SubmissionList.js
import React from "react";

function SubmissionList({ submissions }) {
    return (
        <div>
            <h3>Submissions</h3>
            {submissions.map((submission) => (
                <div style={{ border: "1px solid black" }} key={submission._id}>
                    <p>Language: {submission.language}</p>
                    <p>Submission Time: {submission.submission_time}</p>
                    {submission.results && (
                        <>
                            <h4>Results:</h4>
                            <ul>
                                {submission.results.map((result, i) => (
                                    <li key={result._id}>
                                        <p>
                                            Test Case {i + 1}: {result.status}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default SubmissionList;

// ProblemDetails.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SubmissionList from "./SubmissionList";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";

function ProblemDetails() {
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const { id } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/problems/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setProblem(response.data);
            } catch (err) {
                alert("Error while fetching problem!");
            }
        }
        fetchData();
    }, [id, token]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/problems/${id}/submissions`, { headers: { Authorization: `Bearer ${token}` } });
                setSubmissions(response.data);
            } catch (err) {
                // alert("Error while fetching submission!");
            }
        }
        fetchData();
    }, [id, token]);

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                `/problems/${id}/submissions`,
                { language: selectedLanguage, code },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!problem) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <div>
                <textarea rows="10" cols="50" value={code} onChange={handleCodeChange} placeholder="Enter your code here" />
            </div>
            <div>
                <select value={selectedLanguage} onChange={handleLanguageChange}>
                    <option value="">Select Language</option>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                </select>
            </div>
            <div>
                <button onClick={handleSubmit}>Submit Code</button>
            </div>
            <SubmissionList submissions={submissions} />
        </div>
    );
}

export default ProblemDetails;

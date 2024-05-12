// ProblemList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";

function ProblemList() {
    // State to store the list of problems
    const [problems, setProblems] = useState([]);
    const token = useSelector((state) => state.auth.token);
    // Fetching problems from backend API
    useEffect(() => {
        // Example API endpoint to fetch problems
        async function fetchData() {
            const response = await axios.get("/problems", { headers: { Authorization: `Bearer ${token}` } });
            setProblems(response.data);
        }
        fetchData();
    }, [token]);

    return (
        <div>
            <h2>Problem List</h2>
            <ul>
                {problems.map((problem) => (
                    <li key={problem._id}>
                        <Link to={`/problems/${problem._id}`}>
                            <strong>{problem.title}</strong>
                        </Link>
                        <p>{problem.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProblemList;

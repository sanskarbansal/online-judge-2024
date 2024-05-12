// Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault();
        async function makeRequest() {
            try {
                const response = await axios.post("/auth/signup", { email, name, password });
                console.log(response.data);
                alert("User registered successfully!");
                navigate("/login");
            } catch (err) {
                console.log(err);
                alert("Error while registering!");
            }
        }
        makeRequest();
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;

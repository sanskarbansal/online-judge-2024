// Login.js
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { login, loginWithStoredToken } from "../redux/actions/authAction";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = (event) => {
        event.preventDefault();
        async function makeRequest() {
            try {
                // const response = await axios.post("/auth/login", { email, password });
                // console.log(response.data);
                dispatch({ type: "LOADING_START" });
                dispatch(login(email, password));
                alert("User registered successfully!");
                navigate("/login");
            } catch (err) {
                console.log(err);
                alert("Error while registering!");
            }
        }
        makeRequest();
        navigate("/");
    };

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const location = useLocation();

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            dispatch(loginWithStoredToken(authToken));
        } else {
            dispatch({ type: "LOADING_STOP" });
        }
    }, [dispatch]);

    if (isAuthenticated) {
        return <Navigate to={`${location.state?.from?.pathname || "/problems"}`} />; // Replace "/dashboard" with the desired route
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;

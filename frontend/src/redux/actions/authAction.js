import axios from "../../axiosInstance";
import { LOGIN_SUCCESS, AUTH_LOGOUT } from "./types";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: "LOGIN_REQUEST" }); // Dispatch a request action

        const response = await axios.post("/auth/login", { email, password });
        const { user, token } = response.data;
        localStorage.setItem("authToken", token);

        dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
    } catch (error) {
        dispatch({ type: "ERROR", payload: error });
        alert("Error while login. ");
    }
};

export const loginWithStoredToken = (token) => async (dispatch) => {
    try {
        dispatch({ type: "LOGIN_REQUEST" });
        dispatch({ type: "LOADING_START" });

        // Fetch user data using the stored token
        const response = await axios.get("/auth/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { user } = response.data;

        dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
    } catch (error) {
        alert("error while login in");
        // dispatch({ type: LOGIN_FAILURE, payload: error.message });
    } finally {
        dispatch({ type: "LOADING_STOP" });
    }
};

export const logout = () => async (dispatch) => {
    try {
        dispatch({ type: AUTH_LOGOUT });
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

import { AUTH_LOGOUT, LOGIN_SUCCESS, UPDATE_USER } from "../actions/types";

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
    loading: true,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
            };
        case AUTH_LOGOUT:
            localStorage.removeItem("authToken");
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
            };
        default:
            return state;
    }
};

export default authReducer;

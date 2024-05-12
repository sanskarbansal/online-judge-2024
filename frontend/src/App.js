import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./compnents/Login";
import Register from "./compnents/Register";
import PrivateRoute from "./compnents/PrivateRoute";
import ProblemList from "./compnents/ProblemList";
import ProblemDetails from "./compnents/ProblemDetails";

function App() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="login" element={<Login />} />
                <Route exact path="register" element={<Register />} />
                <Route
                    path="/problems"
                    element={
                        <PrivateRoute>
                            <ProblemList />
                        </PrivateRoute>
                    }
                ></Route>
                <Route
                    path="/problems/:id"
                    element={
                        <PrivateRoute>
                            <ProblemDetails />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;

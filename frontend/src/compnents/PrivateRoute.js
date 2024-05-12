import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    // const isLoading = useSelector((state) => state.auth.loading); // Add loading state

    let location = useLocation();

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // } else
    if (isAuthenticated) {
        return children;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default PrivateRoute;

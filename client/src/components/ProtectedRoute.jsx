import { Navigate } from "react-router-dom";

// Show the page only when logged in; otherwise send the user to /login
// `children` is the page this wraps, e.g. <Home />
function ProtectedRoute({ token, children }) {
    return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

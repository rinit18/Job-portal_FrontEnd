import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const token = useSelector((state: any) => state.jwt);
    if (!token) {
        return <Navigate to="/login" />
    }
    
    try {
        const decoded: any = jwtDecode(token);
        const type = decoded.accountType || "";
        if (allowedRoles && !allowedRoles.includes(type)) return <Navigate to="/unauthorized" />;
    } catch (error) {
        return <Navigate to="/login" />
    }

    return children;
}
export default ProtectedRoute;
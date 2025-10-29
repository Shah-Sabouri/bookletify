import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { JSX } from "@emotion/react/jsx-runtime";

interface Props {
    children: JSX.Element;
    role?: "admin" | "user";
}

export default function RequireAuth({ children, role }: Props) {
    const { user, token } = useAuth();
    
    // Not logged in

    if (!token || !user) {
        return <Navigate to="/auth" replace />;
    }

    // Role check
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

/** @format */

import { useAuthStore } from "@/store";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};

export { ProtectedRoute };

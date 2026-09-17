import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { WaveSpinner } from ".";
import { AUTH_ROLES } from "../../auth/constants";
import { useProfile } from "../../auth/hooks/profile";

const ProtectedRoute = ({ roles = Object.values(AUTH_ROLES) }: { roles?: string[] }) => {
    const { user, isLoading, error } = useProfile();
    const location = useLocation();
    const queryClient = useQueryClient();

    if (isLoading) {
        return <WaveSpinner />;
    }

    if (!user?.id || error) {
        queryClient.cancelQueries();
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user.role || !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

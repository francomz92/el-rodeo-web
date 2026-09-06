import { Outlet, Navigate, useLocation } from "react-router-dom";

import { WaveSpinner } from ".";
import { AUTH_ROLES } from "../../auth/constants";
import { useProfile } from "../../auth/hooks/profile";
import DashboardLayout from "../../../layers/dashboard";

const ProtectedRoute = ({ roles = Object.values(AUTH_ROLES) }: { roles?: string[] }) => {
    const { user, isLoading } = useProfile();
    const location = useLocation();

    if (isLoading) {
        return <WaveSpinner />;
    }

    if (!user?.id) {
        return (window.location.href = "/login");
    }

    if (!roles.includes(user?.role)) {
        return <Navigate to="/unauthorized" state={{ from: location }} />;
    }

    const Dashboard = DashboardLayout

    return (
        <Dashboard>
            <Outlet />
        </Dashboard>
    )
};

export default ProtectedRoute;

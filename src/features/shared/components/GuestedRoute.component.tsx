import { Outlet, Navigate } from "react-router-dom"

import { useProfile } from "../../auth/hooks/profile";
import { WaveSpinner } from ".";

const GuestedRoute = () => {
    const { user, isLoading } = useProfile();

    if (isLoading) {
        return <WaveSpinner />;
    }

    if (user?.id) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default GuestedRoute;

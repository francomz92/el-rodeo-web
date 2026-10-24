import { createBrowserRouter } from "react-router-dom";

import { authRouter } from "@auth/routers";
import { cattleRouter } from "@cattle/routers";
import { financeRouter } from "@finance/routers";
import { analyticsRouter } from "@analytics/routers";
import { reportsRouter } from "@reports/routers";
import { lazy } from "react";
import ProtectedRoute from "@components/ProtectedRoute.component";
import GuestedRoute from "@components/GuestedRoute.component";
import { AUTH_ROLES } from "@auth/constants";

const Home = lazy(() => import("@shared/pages/home"));
const NotFound = lazy(() => import("@shared/pages/notFound"));
const Layout = lazy(() => import("../layers/layout"));

export default createBrowserRouter([
    {
        element: <GuestedRoute />,
        children: [...authRouter.public],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <Home /> },
                    {
                        element: <ProtectedRoute roles={[AUTH_ROLES.ADMIN, AUTH_ROLES.OWNER, AUTH_ROLES.SUPERADMIN]} />,
                        children: [
                            ...analyticsRouter.privated,
                            ...authRouter.privated,
                        ],
                    },
                    ...cattleRouter.privated,
                    ...financeRouter.privated,
                    {
                        element: <ProtectedRoute roles={[AUTH_ROLES.ADMIN, AUTH_ROLES.OWNER, AUTH_ROLES.SUPERADMIN]} />,
                        children: reportsRouter.privated,
                    },
                    { path: "*", element: <NotFound /> },
                ],
            },
        ],
    },
]);

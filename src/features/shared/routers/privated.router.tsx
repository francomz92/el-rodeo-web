import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import { ProtectedRoute } from "../components";

const Dashboard = lazy(() => import("../pages/home"))
const NotFound = lazy(() => import("../pages/notFound"));

const dashboardRouter: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]

export default dashboardRouter;

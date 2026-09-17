import { createBrowserRouter } from "react-router-dom";

import { authRouter } from "@auth/routers";
import { cattleRouter } from "@cattle/routers";
import { financeRouter } from "@finance/routers";
import { analyticsRouter } from "@analytics/routers";
import { lazy } from "react";
import ProtectedRoute from "@components/ProtectedRoute.component";
import GuestedRoute from "@components/GuestedRoute.component";

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
                    ...analyticsRouter.privated,
                    ...authRouter.privated,
                    ...cattleRouter.privated,
                    ...financeRouter.privated,
                    { path: "*", element: <NotFound /> },
                ],
            },
        ],
    },
]);

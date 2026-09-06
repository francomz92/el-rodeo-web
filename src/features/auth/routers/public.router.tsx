import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import { GuestedRoute } from "@components/index";

const LoginPage = lazy(() => import("../pages/logIn"))


const publicRouter: RouteObject[] = [
    {
        element: <GuestedRoute />,
        children: [
            {
                path: "login",
                element: <LoginPage />,
            }
        ]
    }
];

export default publicRouter;

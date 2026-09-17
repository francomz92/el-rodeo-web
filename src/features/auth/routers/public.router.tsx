import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const LoginPage = lazy(() => import("../pages/logIn"))


const publicRouter: RouteObject[] = [
    {
        path: "login",
        element: <LoginPage />,
    }
];

export default publicRouter;

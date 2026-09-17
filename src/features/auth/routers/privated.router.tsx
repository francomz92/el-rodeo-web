import { lazy } from "react";
import type { RouteObject } from "react-router-dom";


const ProfilePage = lazy(() => import("../pages/profile"))
const Users = lazy(() => import("../pages/users"))

const privatedRouter: RouteObject[] = [
    {
        path: "me",
        element: <ProfilePage />,
    },
    {
        path: "users",
        element: <Users />,
    },
];

export default privatedRouter;

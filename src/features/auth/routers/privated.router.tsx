import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "@components/ProtectedRoute.component";
import { AUTH_ROLES } from "@auth/constants";

const ProfilePage = lazy(() => import("../pages/profile"))
const Users = lazy(() => import("../pages/users"))

const privatedRouter: RouteObject[] = [
    {
        path: "me",
        element: <ProfilePage />,
    },
    {
        element: <ProtectedRoute roles={[AUTH_ROLES.ADMIN, AUTH_ROLES.OWNER, AUTH_ROLES.SUPERADMIN]} />,
        children: [
            {
                path: "users",
                element: <Users />,
            },
        ],
    },
];

export default privatedRouter;

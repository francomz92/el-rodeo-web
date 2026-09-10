import type { RouteObject } from "react-router-dom"

import { ProtectedRoute } from "@components/index"
import { lazy } from "react"


const Analytics = lazy(() => import("../pages/analytics"))


const privatedRoutes: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "analytics",
                element: <Analytics />
            }
        ]
    }
]

export default privatedRoutes

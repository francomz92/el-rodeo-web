import type { RouteObject } from "react-router-dom"

import { ProtectedRoute } from "@components/index"
import { lazy } from "react"


const Supplies = lazy(() => import("../pages/supplies"))


const privatedRoutes: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "supplies",
                element: <Supplies />
            }
        ]
    }
]

export default privatedRoutes

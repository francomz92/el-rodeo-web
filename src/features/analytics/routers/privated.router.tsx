import type { RouteObject } from "react-router-dom"

import { lazy } from "react"


const Analytics = lazy(() => import("../pages/analytics"))


const privatedRoutes: RouteObject[] = [
    {
        index: true,
        path: "analytics",
        element: <Analytics />
    }
]

export default privatedRoutes

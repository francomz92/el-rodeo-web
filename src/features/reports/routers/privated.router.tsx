import type { RouteObject } from "react-router-dom"

import { lazy } from "react"


const Reports = lazy(() => import("../pages/reports"))


const privatedRoutes: RouteObject[] = [
    {
        index: true,
        path: "reports",
        element: <Reports />
    }
]

export default privatedRoutes

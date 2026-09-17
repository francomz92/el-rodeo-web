import type { RouteObject } from "react-router-dom"

import { lazy } from "react"


const Supplies = lazy(() => import("../pages/supplies"))


const privatedRoutes: RouteObject[] = [
    {
        path: "supplies",
        element: <Supplies />
    }
]

export default privatedRoutes

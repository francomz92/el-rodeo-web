import type { RouteObject } from "react-router-dom"

import { lazy } from "react"


const Supplies = lazy(() => import("../pages/supplies"))
const Purchases = lazy(() => import("../pages/purchases"))


const privatedRoutes: RouteObject[] = [
    {
        path: "supplies",
        element: <Supplies />
    },
    {
        path: "purchases",
        element: <Purchases />
    }
]

export default privatedRoutes

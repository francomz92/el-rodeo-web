import type { RouteObject } from "react-router-dom"

import { lazy } from "react"


const Animals = lazy(() => import("../pages/animals"))
const Calendar = lazy(() => import("../pages/calendar"))


const privatedRoutes: RouteObject[] = [
    {
        path: "cattle",
        element: <Animals />
    },
    {
        path: "calendar",
        element: <Calendar />
    }
]

export default privatedRoutes

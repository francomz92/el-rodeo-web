import type { RouteObject } from "react-router-dom"

import { ProtectedRoute } from "@components/index"
import { lazy } from "react"


const Animals = lazy(() => import("../pages/animals"))
const Calendar = lazy(() => import("../pages/calendar"))


const privatedRoutes: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "cattle",
                element: <Animals />
            },
            {
                path: "calendar",
                element: <Calendar />
            }
        ]
    }
]

export default privatedRoutes

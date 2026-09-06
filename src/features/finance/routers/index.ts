import type { RouteObject } from "react-router-dom"

import privatedRoutes from "./privated.router"


export const financeRouter: RouteObject[] = [ ...privatedRoutes ]

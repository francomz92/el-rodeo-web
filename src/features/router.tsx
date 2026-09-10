import { createBrowserRouter } from "react-router-dom";

import { authRouter } from "@auth/routers";
import { dashboardRouter } from "@shared/routers";
import { cattleRouter } from "@cattle/routers"
import { financeRouter } from "@finance/routers"
import { analyticsRouter } from "@analytics/routers"


export default createBrowserRouter([
    ...authRouter,
    ...dashboardRouter,
    ...cattleRouter,
    ...financeRouter,
    ...analyticsRouter,
]);

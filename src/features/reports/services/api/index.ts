import { httpClient } from "@shared/utils/http/clients"

import ReportsAPI from "./reports.api.service";


export const reportsAPI = new ReportsAPI(httpClient);

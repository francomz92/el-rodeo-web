import { httpClient } from "@shared/utils/http/clients"

import AnalyticsAPI from "./analytics.api.service";


export const analyticsAPI = new AnalyticsAPI(httpClient);

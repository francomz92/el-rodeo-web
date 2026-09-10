import type { IHttpClient } from "@shared/interfaces/http/clients";

import { REPORT_ENDPOINTS } from "../../constants";
import type { AnalyticsFilterQueryParams } from "@analytics/schemas/input/analytics.schemas";
import type { InventorySummaryResponse, SalesSummaryResponse } from "@analytics/schemas/output/analytics";

class AnalyticsAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    getInventorySummary(): Promise<InventorySummaryResponse> {
        return this.httpClient.get(REPORT_ENDPOINTS.getInventorySummary, {})
    }

    getSalesSummary(queryParams: AnalyticsFilterQueryParams): Promise<SalesSummaryResponse> {
        const params = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value)
        )
        return this.httpClient.get(REPORT_ENDPOINTS.getSalesSummary, params)
    }
}

export default AnalyticsAPI;

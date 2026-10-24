import type { IHttpClient, DownloadedFileSchema } from "@shared/interfaces/http/clients";

import type { ReportCatalogEntry } from "../../reportCatalog";
import type { ReportFormat } from "../../schemas/output/reports";
import { REPORT_EXPORT_ENDPOINTS } from "../../constants";

class ReportsAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    exportReport(
        entry: ReportCatalogEntry,
        filters: Record<string, string>,
        format: ReportFormat,
    ): Promise<DownloadedFileSchema> {
        const path = entry.endpoint ?? REPORT_EXPORT_ENDPOINTS.exportSalesSummary
        return this.httpClient.getBlob(path, { ...filters, format })
    }
}

export default ReportsAPI;

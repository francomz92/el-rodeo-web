import type { IHttpClient } from "@shared/interfaces/http/clients";

import { SUPPLY_TYPE_ENDPOINTS } from "../../constants";
import type { SupplyTypeResponseSchema } from "@finance/schemas/output/supplyType";

class SupplyTypeAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    getList(): Promise<SupplyTypeResponseSchema[]> {
        return this.httpClient.get(SUPPLY_TYPE_ENDPOINTS.getSupplyList, {})
    }
}

export default SupplyTypeAPI;

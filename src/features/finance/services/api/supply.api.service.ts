import { formatString } from "@shared/utils/strings.utils";
import type { IHttpClient } from "@shared/interfaces/http/clients";

import { SUPPLY_ENDPOINTS } from "../../constants";
import type { SupplyCreationType, SupplyListQueryParams, SupplyUpdateType } from "@finance/schemas/input/supply.schemas";
import type { SupplyResponseSchema } from "@finance/schemas/output/supply";

class SupplyAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    getList(queryParams: SupplyListQueryParams): Promise<SupplyResponseSchema[]> {
        const params = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value)
        )
        return this.httpClient.get(SUPPLY_ENDPOINTS.getSupplyList, params)
    }

    getById(supplyId: string): Promise<SupplyResponseSchema> {
        return this.httpClient.get(formatString(SUPPLY_ENDPOINTS.getSupply, { supplyId }))
    }

    create(data: SupplyCreationType): Promise<SupplyResponseSchema> {
        return this.httpClient.post(SUPPLY_ENDPOINTS.createSupply, data)
    }

    update(supplyId: string, data: SupplyUpdateType): Promise<SupplyResponseSchema> {
        return this.httpClient.put(formatString(SUPPLY_ENDPOINTS.updateSupply, { supplyId }), data)
    }

    delete(supplyId: string): Promise<void> {
        return this.httpClient.delete(formatString(SUPPLY_ENDPOINTS.deleteSupply, { supplyId }))
    }
}

export default SupplyAPI;

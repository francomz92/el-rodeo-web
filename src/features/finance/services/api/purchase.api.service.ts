import { formatString } from "@shared/utils/strings.utils";
import type { IHttpClient } from "@shared/interfaces/http/clients";

import { PURCHASE_ENDPOINTS } from "../../constants";
import type { PurchaseCreationType, PurchaseListQueryParams } from "@finance/schemas/input/purchase.schemas";
import type { PurchaseResponseSchema } from "@finance/schemas/output/purchase";

class PurchaseAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    getList(queryParams: PurchaseListQueryParams): Promise<PurchaseResponseSchema[]> {
        const params = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value)
        )
        return this.httpClient.get(PURCHASE_ENDPOINTS.getPurchaseList, params)
    }

    getById(purchaseId: string): Promise<PurchaseResponseSchema> {
        return this.httpClient.get(formatString(PURCHASE_ENDPOINTS.getPurchase, { purchaseId }))
    }

    create(data: PurchaseCreationType): Promise<PurchaseResponseSchema> {
        return this.httpClient.post(PURCHASE_ENDPOINTS.createPurchase, data)
    }

    confirm(purchaseId: string): Promise<PurchaseResponseSchema> {
        return this.httpClient.post(formatString(PURCHASE_ENDPOINTS.confirmPurchase, { purchaseId }), {})
    }

    delete(purchaseId: string): Promise<void> {
        return this.httpClient.delete(formatString(PURCHASE_ENDPOINTS.deletePurchase, { purchaseId }))
    }
}

export default PurchaseAPI;

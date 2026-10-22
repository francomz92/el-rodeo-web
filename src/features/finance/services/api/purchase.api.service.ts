import type { IHttpClient } from "@shared/interfaces/http/clients";

class PurchaseAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }
};

export default purchaseApiService;

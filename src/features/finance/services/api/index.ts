import { httpClient } from "@shared/utils/http/clients"

import SupplyAPI from "./supply.api.service";
import SupplyTypeAPI from "./supplyType.api.service";
import PurchaseAPI from "./purchase.api.service";


export const supplyAPI = new SupplyAPI(httpClient);
export const supplyTypeAPI = new SupplyTypeAPI(httpClient);
export const purchaseAPI = new PurchaseAPI(httpClient);

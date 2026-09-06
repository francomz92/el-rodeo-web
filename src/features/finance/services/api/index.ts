import { httpClient } from "@shared/utils/http/clients"

import SupplyAPI from "./supply.api.service";
import SupplyTypeAPI from "./supplyType.api.service";


export const supplyAPI = new SupplyAPI(httpClient);
export const supplyTypeAPI = new SupplyTypeAPI(httpClient);

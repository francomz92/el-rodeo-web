import { IHttpClient } from "../../../shared/interfaces/http/clients"
import { formatString } from "../../../shared/utils/strings.utils"

import { ANIMAL_TYPE_ENDPOINTS } from "../../constants"
import type { AnimalTypeCreationType, AnimalTypeListQueryParams, AnimalTypeUpdateType } from "../../schemas/input/animalType.schemas"
import type { AnimalTypeResponseSchema } from "../../schemas/output/animalTypes"



class AnimalTypeAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    getList(queryParams: AnimalTypeListQueryParams): Promise<AnimalTypeResponseSchema[]> {
        const params = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value)
        )
        return this.httpClient.get(ANIMAL_TYPE_ENDPOINTS.getTypeList, params)
    }

    create(data: AnimalTypeCreationType): Promise<AnimalTypeResponseSchema> {
        return this.httpClient.post(ANIMAL_TYPE_ENDPOINTS.createType, data)
    }

    update(typeId: string, data: AnimalTypeUpdateType): Promise<AnimalTypeResponseSchema> {
        return this.httpClient.put(formatString(ANIMAL_TYPE_ENDPOINTS.updateType, { typeId }), data)
    }
}


export default AnimalTypeAPI;

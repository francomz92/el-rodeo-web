import type { IHttpClient } from "../../../shared/interfaces/http/clients"
import { formatString } from "../../../shared/utils/strings.utils"

import { ANIMAL_TYPE_ENDPOINTS } from "../../constants"
import type { AnimalTypeCreationType, AnimalTypeUpdateType } from "../../schemas/input/animalType.schemas"
import type { AnimalTypeParamsResponseSchema, AnimalTypeResponseSchema } from "../../schemas/output/animalTypes"



class AnimalTypeAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    /** Unpaginated reference list for dropdowns (S4/S5). */
    getParams(): Promise<AnimalTypeParamsResponseSchema[]> {
        return this.httpClient.get(ANIMAL_TYPE_ENDPOINTS.getParams, {})
    }

    create(data: AnimalTypeCreationType): Promise<AnimalTypeResponseSchema> {
        return this.httpClient.post(ANIMAL_TYPE_ENDPOINTS.createType, data)
    }

    update(typeId: string, data: AnimalTypeUpdateType): Promise<AnimalTypeResponseSchema> {
        return this.httpClient.put(formatString(ANIMAL_TYPE_ENDPOINTS.updateType, { typeId }), data)
    }
}


export default AnimalTypeAPI;

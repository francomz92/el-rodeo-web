import type { IHttpClient } from "../../../shared/interfaces/http/clients";
import { formatString } from "../../../shared/utils/strings.utils";
import { ANIMAL_PROTOCOL_ENDPOINTS } from "../../constants";
import type { AnimalProtocolQueryParamsType, AnimalProtocolUpdateType } from "../../schemas/input/animalProtocol.schema";
import type { AnimalProtocolResponseSchema } from "../../schemas/output/animalProtocol";

class AnimalProtocolAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    // getById(animalId: string, protocolId: string): Promise<AnimalProtocolResponseSchema> {
    //     return this.httpClient.get(formatString(ANIMAL_PROTOCOL_ENDPOINTS.getProtocol, { animalId, protocolId }))
    // }

    getByAnimalId(animalId: string): Promise<AnimalProtocolResponseSchema> {
        return this.httpClient.get(formatString(ANIMAL_PROTOCOL_ENDPOINTS.getProtocols, { animalId }))
    }

    // getList(queryParams: AnimalProtocolQueryParamsType, animalId?: string): Promise<AnimalProtocolResponseSchema[]> {
    //     const params: Record<string, any> = Object.fromEntries(
    //         Object.entries(queryParams).filter(([_, value]) => value)
    //     )
    //     if (animalId) {
    //         return this.httpClient.get(formatString(ANIMAL_PROTOCOL_ENDPOINTS.getProtocols, { animalId }), params)
    //     }
    //     return this.httpClient.get(formatString(ANIMAL_PROTOCOL_ENDPOINTS.getProtocols, { animalId: queryParams.animal_id }), params)
    // }

    update(animalId: string, protocolId: string, data: AnimalProtocolUpdateType): Promise<AnimalProtocolResponseSchema> {
        return this.httpClient.put(formatString(ANIMAL_PROTOCOL_ENDPOINTS.updateProtocol, { animalId, protocolId }), data)
    }

    delete(animalId: string, protocolId: string): Promise<void> {
        return this.httpClient.delete(formatString(ANIMAL_PROTOCOL_ENDPOINTS.deleteProtocol, { animalId, protocolId }))
    }
}

export default AnimalProtocolAPI

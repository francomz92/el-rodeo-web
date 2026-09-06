import type { IHttpClient } from "../../../shared/interfaces/http/clients";
import { formatString } from "../../../shared/utils/strings.utils";
import { ANIMAL_ENDPOINTS } from "../../constants";
import type { AnimalCreationType, AnimalListQueryParams, AnimalUpdateType } from "../../schemas/input/animal.schemas";
import type { AnimalListResponseSchema, AnimalResponseSchema } from "../../schemas/output/animal";

class AnimalAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    getList(queryParams: AnimalListQueryParams): Promise<AnimalListResponseSchema> {
        const params = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value)
        )
        return this.httpClient.get(ANIMAL_ENDPOINTS.getAnimalList, params)
    }

    getById(animalId: string): Promise<AnimalResponseSchema> {
        return this.httpClient.get(formatString(ANIMAL_ENDPOINTS.getAnimal, { animalId }))
    }

    create(data: AnimalCreationType): Promise<AnimalResponseSchema> {
        return this.httpClient.post(ANIMAL_ENDPOINTS.createAnimal, data)
    }

    update(animalId: string, data: AnimalUpdateType): Promise<AnimalResponseSchema> {
        return this.httpClient.put(formatString(ANIMAL_ENDPOINTS.updateAnimal, { animalId }), data)
    }

    delete(animalId: string): Promise<void> {
        return this.httpClient.delete(formatString(ANIMAL_ENDPOINTS.deleteAnimal, { animalId }))
    }
}

export default AnimalAPI;

import type { IHttpClient } from "../../../shared/interfaces/http/clients";
import { formatString } from "../../../shared/utils/strings.utils";

import { ANIMAL_SCHEDULE_EVENT_ENDPOINTS } from "../../constants";
import type {
    AnimalScheduleEventQueryParams,
    AnimalScheduleEventCreationType,
    AnimalScheduleEventUpdateType,
} from "../../schemas/input/animalScheduleEvents.schemas";
import type { AnimalScheduleEventResponseSchema } from "../../schemas/output/animalScheduleEvent";

class AnimalScheduleEventAPI {
    private httpClient: IHttpClient

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient
    }

    getList(queryParams: AnimalScheduleEventQueryParams): Promise<AnimalScheduleEventResponseSchema[]> {
        const params = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== null)
        )
        return this.httpClient.get(ANIMAL_SCHEDULE_EVENT_ENDPOINTS.getScheduleEventList, params)
    }

    create(data: AnimalScheduleEventCreationType): Promise<AnimalScheduleEventResponseSchema> {
        return this.httpClient.post(ANIMAL_SCHEDULE_EVENT_ENDPOINTS.createScheduleEvent, data)
    }

    update(eventId: string, data: AnimalScheduleEventUpdateType): Promise<AnimalScheduleEventResponseSchema> {
        return this.httpClient.put(formatString(ANIMAL_SCHEDULE_EVENT_ENDPOINTS.updateScheduleEvent, { eventId }), data)
    }

    delete(eventId: string): Promise<void> {
        return this.httpClient.delete(formatString(ANIMAL_SCHEDULE_EVENT_ENDPOINTS.deleteScheduleEvent, { eventId }))
    }
}

export default AnimalScheduleEventAPI;

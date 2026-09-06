import { httpClient } from "../../../shared/utils/http/clients"

import AnimalAPI from "./animals.api.service";
import AnimalTypeAPI from "./animalTypes.api.service";
import AnimalProtocolAPI from "./animalProtocols.api.service";
import AnimalScheduleEventAPI from "./animalScheduleEvent.api.service";


export const animalAPI = new AnimalAPI(httpClient);
export const animalTypeAPI = new AnimalTypeAPI(httpClient);
export const animalProtocolAPI = new AnimalProtocolAPI(httpClient);
export const animalScheduleEventAPI = new AnimalScheduleEventAPI(httpClient);

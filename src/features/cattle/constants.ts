export const ANIMAL_ENDPOINTS = {
    getAnimal: "/cattle/animals/{animalId}",
    getAnimalList: "/cattle/animals",
    createAnimal: "/cattle/animals",
    updateAnimal: "/cattle/animals/{animalId}",
    deleteAnimal: "/cattle/animals/{animalId}",
};

export const ANIMAL_TYPE_ENDPOINTS = {
    getTypeList: "/cattle/animal-types",
    createType: "/cattle/animal-types",
    updateType: "/cattle/animal-types/{typeId}",
};

export const ANIMAL_PROTOCOL_ENDPOINTS = {
    // getProtocol: "/cattle/animals/{animalId}/protocols/{protocolId}",
    getProtocols: "/cattle/animals/{animalId}/protocols",
    updateProtocol: "/cattle/animals/{animalId}/protocols/{protocolId}",
    deleteProtocol: "/cattle/animals/{animalId}/protocols/{protocolId}",
};

export const ANIMAL_SCHEDULE_EVENT_ENDPOINTS = {
    getScheduleEventList: "/cattle/schedule-events",
    createScheduleEvent: "/cattle/schedule-events",
    updateScheduleEvent: "/cattle/schedule-events/{eventId}",
    deleteScheduleEvent: "/cattle/schedule-events/{eventId}",
};


export const ANIMAL_STATUS = {
    Disponible: "disponible",
    "No disponible": "no_disponible",
    Vendido: "vendido"
};

export const STATUS_STYLES: Record<string, string> = {
    Disponible: "badge-role badge-role-ok",
    "No disponible": "badge-role badge-role-warn",
    Vendido: "badge-role badge-role-info",
};

export const ANIMAL_TYPES = {
    EQUINO: "Equino",
    PORCINO: "Porcino",
    CAPRINO: "Caprino",
    OVINO: "Ovino",
    VACUNO: "Vacuno"
}

export const AnimalEventTypes = {
    vacunacion: "vacunacion",
    remate: "remate",
    reunion: "reunion",
    veterinario: "veterinario",
    pesaje: "pesaje",
    marcado: "marcado",
    desparasitacion: "desparasitacion",
    transporte: "transporte",
    otro: "otro",
};

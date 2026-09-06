import type { AnimalResponseSchema } from "./animal";

export type EventParticipant = {
    id: string;
    name: string;
};

export type AnimalScheduleEventResponseSchema = {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    pending: boolean;
    type: string
    participants: EventParticipant[];
    selected?: boolean; //HACK: solo se utiliza para marcar el evento como seleccionado en el calendario (No viene en el HTTPResponse)
};

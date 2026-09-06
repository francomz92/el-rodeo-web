import type { AnimalScheduleEventResponseSchema } from "@cattle/schemas/output/animalScheduleEvent";

export interface EventDataInput {
    id: string;
    title: string;
    start: string;
    end: string;
    date: string;
    extendedProps: ExtendedEventProps;
}

interface ExtendedEventProps extends AnimalScheduleEventResponseSchema {
    style: EventStyle;
}

export interface EventStyle {
    bgColorMuted?: string;
    bgColor?: string;
    borderColor?: string;
    beforeEventStyle?: string;
    daysHeaderStyle?: string;
}

export type EventType =
    | "vacunacion"
    | "remate"
    | "reunion"
    | "veterinario"
    | "pesaje"
    | "marcado"
    | "desparasitacion"
    | "transporte"
    | "otro";

export type EventTypeColorOptions = EventType | "default"

export type EventLabelType = Exclude<EventType, "default">

export type EventStatusType = "pendiente" | "completado" // | "cancelado"

export interface EventFilters {
    type: EventType | null;
    participants: string[] | null;
    pending: boolean | null;
}

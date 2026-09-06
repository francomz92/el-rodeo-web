import { z } from "zod";
import { parseAsArrayOf, parseAsBoolean, parseAsString, type inferParserType } from "nuqs"

import { AnimalEventTypes } from "@cattle/constants";


export const AnimalScheduleEventCreationValidationSchema = z.object({
    title: z.string().max(50, "Debe tener como máximo 50 caracteres").min(8, "Debe tener como mínimo 8 caracteres"),
    description: z.string().max(255, "Debe tener como máximo 255 caracteres"),
    start: z.iso.datetime(),
    end: z.iso.datetime(),
    type: z.enum(Object.values(AnimalEventTypes), "Seleccione un tipo de evento"),
    participants: z.array(z.string())
}).refine(data => data.end > data.start, {
    error: "El fin del evento debe ser posterior al inicio",
    path: ["end"]
});

export const AnimalScheduleEventUpdateValidationSchema = z.object({
    title: z.string().max(50, "Debe tener como máximo 50 caracteres").min(8, "Debe tener como mínimo 8 caracteres"),
    description: z.string().max(255, "Debe tener como máximo 255 caracteres"),
    start: z.iso.datetime(),
    end: z.iso.datetime(),
    type: z.enum(Object.values(AnimalEventTypes), "Seleccione un tipo de evento"),
    participants: z.array(z.string())
}).refine(data => data.end > data.start, {
    error: "El fin del evento debe ser posterior al inicio",
    path: ["end"]
});

export const AnimalScheduleEventQueryParamsSchema = {
    title: parseAsString,
    start: parseAsString,
    end: parseAsString,
    type: parseAsString,
    participants: parseAsArrayOf(parseAsString),
    pending: parseAsBoolean,
}


export type AnimalScheduleEventCreationType = z.infer<typeof AnimalScheduleEventCreationValidationSchema>
export type AnimalScheduleEventUpdateType = z.infer<typeof AnimalScheduleEventUpdateValidationSchema>
export type AnimalScheduleEventQueryParams = inferParserType<typeof AnimalScheduleEventQueryParamsSchema>

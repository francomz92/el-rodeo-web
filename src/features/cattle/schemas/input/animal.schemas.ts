import z from "zod"
import { parseAsString, type inferParserType } from "nuqs"

import { baseQueryParamsFilter } from "../../../shared/schemas/input/queryParams.shcemas"
import { ANIMAL_STATUS } from "../../constants";


export const AnimalCreationValidationSchema = z.object({
    type_id: z.string(),
    caravana: z.string().max(50, "Debe tener como máximo 50 carácteres"),
    breed: z.string().max(50, "Debe tener como máximo 50 carácteres"),
    tag: z.string().max(50, "Debe tener como máximo 50 carácteres").default(""),
    date_of_birth: z.iso.date(),
    initial_weight: z.number("Debe ingresar un número válido").positive("Debe ingresar un número válido"),
    initial_weight_date: z.iso.date(),
});

export const AnimalUpdateValidationSchema = z.object({
    type_id: z.string(),
    caravana: z.string().max(50, "Debe tener como máximo 50 carácteres"),
    breed: z.string().max(50, "Debe tener como máximo 50 carácteres"),
    tag: z.string().max(50, "Debe tener como máximo 50 carácteres").default(""),
    date_of_birth: z.iso.date(),
    initial_weight: z.number("Debe ingresar un número válido").positive("Debe ingresar un número válido"),
    initial_weight_date: z.iso.date(),
    last_weight: z.number("Debe ingresar un número válido").positive("Debe ingresar un número válido"),
    status: z.enum(Object.values(ANIMAL_STATUS), "Seleccione un estado válido"),
});

export const AnimalListQueryParamsSchema = {
    type_id: parseAsString,
    caravana: parseAsString,
    breed: parseAsString,
    ...baseQueryParamsFilter,
}

export type AnimalCreationType = z.infer<typeof AnimalCreationValidationSchema>
export type AnimalUpdateType = z.infer<typeof AnimalUpdateValidationSchema>
export type AnimalListQueryParams = inferParserType<typeof AnimalListQueryParamsSchema>

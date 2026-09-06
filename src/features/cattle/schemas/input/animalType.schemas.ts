import z from "zod"
import { parseAsString, type inferParserType } from "nuqs"

import { baseQueryParamsFilter } from "../../../shared/schemas/input/queryParams.shcemas"


export const AnimalTypeCreateValidationSchema = z.object({
    name: z.string().max(50, "Debe tener como máximo 50 caracteres")
})

export const AnimalTypeUpdateValidationSchema = z.object({
    name: z.string().max(50, "Debe tener como máximo 50 caracteres")
})

export const AnimalTypeQueryParamsSchema = {
    id: parseAsString,
    name: parseAsString,
    ...baseQueryParamsFilter,
}

export type AnimalTypeCreationType = z.infer<typeof AnimalTypeCreateValidationSchema>
export type AnimalTypeUpdateType = z.infer<typeof AnimalTypeUpdateValidationSchema>
export type AnimalTypeListQueryParams = inferParserType<typeof AnimalTypeQueryParamsSchema>

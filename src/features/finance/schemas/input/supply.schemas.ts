import z from "zod"
import { parseAsString, type inferParserType } from "nuqs"

import { baseQueryParamsFilter } from "../../../shared/schemas/input/queryParams.shcemas"


export const SupplyCreationValidationSchema = z.object({
    type_id: z.string(),
    name: z.string().max(50, "Debe tener como mucho 50 caracteres"),
    amount: z.number("Debe ingresar un número").positive("Solo se permiten números positivos"),
    critical_amount: z.number("Debe ingresar un número").positive("Solo se permiten números positivos"),
    unit_of_measurement: z.string(),
    description: z.string().max(500, "Debe tener como mucho 500 caracteres").default(""),
});

export const SupplyUpdateValidationSchema = z.object({
    type_id: z.string(),
    name: z.string(),
    amount: z.number(),
    critical_amount: z.number(),
    unit_of_measurement: z.string(),
    description: z.string().default(""),
});

export const SupplyListQueryParamsSchema = {
    id: parseAsString,
    type_id: parseAsString,
    name: parseAsString,
    ...baseQueryParamsFilter,
}

export type SupplyCreationType = z.infer<typeof SupplyCreationValidationSchema>
export type SupplyUpdateType = z.infer<typeof SupplyUpdateValidationSchema>
export type SupplyListQueryParams = inferParserType<typeof SupplyListQueryParamsSchema>

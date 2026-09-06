import { z } from "zod";
import { parseAsBoolean, parseAsString, type inferParserType } from "nuqs"

import { baseQueryParamsFilter } from "../../../shared/schemas/input/queryParams.shcemas";

export const AnimalProtocolUpdateValidationSchema = z.object({
    vaccinated: z.boolean().nullable(),
    vaccinated_date: z.iso.date().nullable(),
    sale_permission: z.boolean().nullable(),
    sale_permission_date: z.iso.date().nullable()
});

export const AnimalProtocolQueryParamsSchema = {
    animal_id: parseAsString,
    vaccinated: parseAsBoolean,
    sale_permission: parseAsBoolean,
    ...baseQueryParamsFilter,
}


export type AnimalProtocolUpdateType = z.infer<typeof AnimalProtocolUpdateValidationSchema>;
export type AnimalProtocolQueryParamsType = inferParserType<typeof AnimalProtocolQueryParamsSchema>;

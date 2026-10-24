import { z } from 'zod';
import { parseAsIsoDate, parseAsString, type inferParserType } from 'nuqs';
import { baseQueryParamsFilter } from '@shared/schemas/input/queryParams.shcemas';

export const PurchaseCreationValidationSchema = z.object({
    supply_id: z.string(),
    amount: z.number().positive("Debe ser in valor positivo"),
    price: z.number().positive("Debe ser in valor positivo"),
    purchase_date: z.iso.date(),
    unit_price: z.number().positive("Debe ser in valor positivo"),
    unit_of_measurement: z.string(),
});

export const PurchaseListQueryParamsSchema = {
    id: parseAsString,
    purchase_date: parseAsIsoDate,
    unit_of_measurement: parseAsString,
    supply_id: parseAsString,
    ...baseQueryParamsFilter,
};


export type PurchaseCreationType = z.infer<typeof PurchaseCreationValidationSchema>;
export type PurchaseListQueryParams = inferParserType<typeof PurchaseListQueryParamsSchema>;

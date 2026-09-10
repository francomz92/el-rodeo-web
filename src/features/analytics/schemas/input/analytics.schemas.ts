import z from "zod";
import { parseAsString, type inferParserType } from "nuqs";


export const ANALYTICS_MAX_RANGE_DAYS = 365;


const toUtcMidnight = (value: string): number => {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
};

export const AnalyticsRangeValidationSchema = z
    .object({
        from_date: z.iso.date("Debe ingresar una fecha válida (AAAA-MM-DD)"),
        to_date: z.iso.date("Debe ingresar una fecha válida (AAAA-MM-DD)"),
    })
    .refine(
        ({ from_date, to_date }) => from_date <= to_date,
        {
            message: "La fecha de inicio debe ser anterior o igual a la fecha de fin",
            path: ["from_date"],
        },
    )
    .refine(
        ({ from_date, to_date }) =>
            (toUtcMidnight(to_date) - toUtcMidnight(from_date)) / 86_400_000 <= ANALYTICS_MAX_RANGE_DAYS,
        {
            message: "El rango no puede superar los 365 días",
            path: ["to_date"],
        },
    );

export const AnalyticsFilterQueryParamsSchema = {
    from_date: parseAsString,
    to_date: parseAsString,
};

export type AnalyticsRangeType = z.infer<typeof AnalyticsRangeValidationSchema>;
export type AnalyticsFilterQueryParams = inferParserType<typeof AnalyticsFilterQueryParamsSchema>;

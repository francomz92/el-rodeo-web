import z from "zod";


/** Upper bound, in days, accepted by every date-range filter of the app. */
export const MAX_RANGE_DAYS = 365;

const toUtcMidnight = (value: string): number => {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
};

/**
 * Shared `from_date`/`to_date` validation: ISO dates, non-inverted order
 * and a maximum span of {@link MAX_RANGE_DAYS} days. Consumed by analytics
 * and reports so the rule exists exactly once.
 */
export const DateRangeValidationSchema = z
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
            (toUtcMidnight(to_date) - toUtcMidnight(from_date)) / 86_400_000 <= MAX_RANGE_DAYS,
        {
            message: `El rango no puede superar los ${MAX_RANGE_DAYS} días`,
            path: ["to_date"],
        },
    );

export type DateRangeType = z.infer<typeof DateRangeValidationSchema>;

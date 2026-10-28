import { describe, expect, it } from "vitest";

import {
    DateRangeValidationSchema,
    MAX_RANGE_DAYS,
} from "../src/features/shared/schemas/input/dateRange.schemas";
import { AnalyticsRangeValidationSchema } from "../src/features/analytics/schemas/input/analytics.schemas";
import { SalesReportFiltersValidationSchema } from "../src/features/reports/schemas/input/report.schemas";

type RangeResult = ReturnType<typeof DateRangeValidationSchema.safeParse>;

/** Locate the issue carrying `message` and return its path, when the parse failed. */
const issuePath = (result: RangeResult, message: string): (string | number)[] | undefined =>
    result.success ? undefined : result.error.issues.find((issue) => issue.message === message)?.path;

describe("DateRangeValidationSchema", () => {
    it("accepts a one-day range", () => {
        const result = DateRangeValidationSchema.safeParse({
            from_date: "2026-03-01",
            to_date: "2026-03-01",
        });

        expect(result.success).toBe(true);
    });

    it("accepts a range of exactly 365 days", () => {
        const result = DateRangeValidationSchema.safeParse({
            from_date: "2026-01-01",
            to_date: "2027-01-01",
        });

        expect(result.success).toBe(true);
    });

    it("rejects a range of 366 days on to_date", () => {
        const result = DateRangeValidationSchema.safeParse({
            from_date: "2026-01-01",
            to_date: "2027-01-02",
        });

        expect(result.success).toBe(false);
        expect(issuePath(result, `El rango no puede superar los ${MAX_RANGE_DAYS} días`)).toEqual(["to_date"]);
    });

    it("rejects an inverted range on from_date", () => {
        const result = DateRangeValidationSchema.safeParse({
            from_date: "2026-03-02",
            to_date: "2026-03-01",
        });

        expect(result.success).toBe(false);
        expect(issuePath(result, "La fecha de inicio debe ser anterior o igual a la fecha de fin")).toEqual(["from_date"]);
    });

    it("rejects a malformed date on from_date", () => {
        const result = DateRangeValidationSchema.safeParse({
            from_date: "01/03/2026",
            to_date: "2026-03-01",
        });

        expect(result.success).toBe(false);
        expect(issuePath(result, "Debe ingresar una fecha válida (AAAA-MM-DD)")).toEqual(["from_date"]);
    });

    it("is the single schema shared by analytics and reports", () => {
        expect(AnalyticsRangeValidationSchema).toBe(DateRangeValidationSchema);
        expect(SalesReportFiltersValidationSchema).toBe(DateRangeValidationSchema);
    });
});

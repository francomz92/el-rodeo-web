import { parseAsString, type inferParserType } from "nuqs";


export { DateRangeValidationSchema as AnalyticsRangeValidationSchema } from "@shared/schemas/input/dateRange.schemas";

export const AnalyticsFilterQueryParamsSchema = {
    from_date: parseAsString,
    to_date: parseAsString,
};

export type AnalyticsFilterQueryParams = inferParserType<typeof AnalyticsFilterQueryParamsSchema>;

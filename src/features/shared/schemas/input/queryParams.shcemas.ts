import { parseAsInteger, parseAsString, type inferParserType } from "nuqs";

export const baseQueryParamsFilter = {
    limit: parseAsInteger.withDefault(10),
    offset: parseAsInteger.withDefault(0),
    order_by: parseAsString.withDefault("id"),
    cursor: parseAsString,
};

export type BaseQueryParams = inferParserType<typeof baseQueryParamsFilter>;

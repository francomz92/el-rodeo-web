import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import salesSummaryQueryKeys from "./queryKeys";
import { analyticsAPI } from "../../services/api";
import { AnalyticsFilterQueryParamsSchema } from "../../schemas/input/analytics.schemas";


const useSalesSummary = () => {
    const [queryParams, setQueryParams] = useQueryStates(AnalyticsFilterQueryParamsSchema);

    const {
        data: salesSummary,
        isPending,
        isError,
    } = useQuery({
        queryKey: salesSummaryQueryKeys.list(queryParams),
        queryFn: () => analyticsAPI.getSalesSummary(queryParams),
        enabled: Boolean(queryParams.from_date && queryParams.to_date),
        placeholderData: (previousData) => previousData,
    })

    return {
        salesSummary,
        isPending,
        isError,
        queryParams,
        setQueryParams,
    }
};

export default useSalesSummary;

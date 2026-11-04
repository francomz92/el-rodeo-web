import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import supplyQueryKeys from "./queryKeys";
import { supplyAPI } from "../../services/api";
import { SupplyListQueryParamsSchema } from "../../schemas/input/supply.schemas";

/** Supplies fetch up to 100 rows (S7: raised limit for the small catalog). */
const SUPPLIES_FETCH_LIMIT = 100;

const useSupplyList = () => {
    const [queryParams, setQueryParams] = useQueryStates(SupplyListQueryParamsSchema);

    const {
        data: supplyPage,
        isPending,
        isError,
    } = useQuery({
        queryKey: supplyQueryKeys.list(queryParams),
        queryFn: () => supplyAPI.getList({ ...queryParams, limit: SUPPLIES_FETCH_LIMIT }),
        placeholderData: (previousData) => previousData,
    })

    return {
        // Bare items key kept for current page bindings; the full
        // {items, total} envelope rides along for the T7/T8 consumers.
        supplyList: supplyPage?.items,
        supplyPage,
        total: supplyPage?.total,
        isPending,
        isError,
        queryParams,
        setQueryParams,
    }
};

export default useSupplyList;

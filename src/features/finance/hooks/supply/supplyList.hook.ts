import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import supplyQueryKeys from "./queryKeys";
import { supplyAPI } from "../../services/api";
import { SupplyListQueryParamsSchema } from "../../schemas/input/supply.schemas";


const useSupplyList = () => {
    const [queryParams, setQueryParams] = useQueryStates(SupplyListQueryParamsSchema);

    const {
        data: supplyList,
        isPending,
        isError,
    } = useQuery({
        queryKey: supplyQueryKeys.list(queryParams),
        queryFn: () => supplyAPI.getList(queryParams),
        placeholderData: (previousData) => previousData,
    })

    return {
        supplyList,
        isPending,
        isError,
        queryParams,
        setQueryParams,
    }
};

export default useSupplyList;

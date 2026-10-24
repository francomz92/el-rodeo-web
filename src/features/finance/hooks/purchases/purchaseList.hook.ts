import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import purchaseQueryKeys from "./queryKeys";
import { purchaseAPI } from "../../services/api";
import { PurchaseListQueryParamsSchema } from "../../schemas/input/purchase.schemas";


const usePurchaseList = () => {
    const [queryParams, setQueryParams] = useQueryStates(PurchaseListQueryParamsSchema);

    const {
        data: purchaseList,
        isPending,
        isError,
    } = useQuery({
        queryKey: purchaseQueryKeys.list(queryParams),
        queryFn: () => purchaseAPI.getList(queryParams),
        placeholderData: (previousData) => previousData,
    })

    return {
        purchaseList,
        isPending,
        isError,
        queryParams,
        setQueryParams,
    }
};

export default usePurchaseList;

import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import purchaseQueryKeys from "./queryKeys";
import { purchaseAPI } from "../../services/api";
import { PurchaseListQueryParamsSchema } from "../../schemas/input/purchase.schemas";


const usePurchaseList = () => {
    const [queryParams, setQueryParams] = useQueryStates(PurchaseListQueryParamsSchema);

    const {
        data: purchasePage,
        isPending,
        isError,
    } = useQuery({
        queryKey: purchaseQueryKeys.list(queryParams),
        queryFn: () => purchaseAPI.getList(queryParams),
        placeholderData: (previousData) => previousData,
    })

    return {
        // Bare items key kept for current page bindings; the full
        // CursorPage envelope rides along for the T7/T8 consumers.
        purchaseList: purchasePage?.items,
        purchasePage,
        total: purchasePage?.total,
        isPending,
        isError,
        queryParams,
        setQueryParams,
    }
};

export default usePurchaseList;

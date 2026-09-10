import { useQuery } from "@tanstack/react-query";

import inventorySummaryQueryKeys from "./queryKeys";
import { analyticsAPI } from "../../services/api";


const useInventorySummary = () => {
    const {
        data: inventorySummary,
        isPending,
        isError,
    } = useQuery({
        queryKey: inventorySummaryQueryKeys.lists(),
        queryFn: () => analyticsAPI.getInventorySummary(),
        placeholderData: (previousData) => previousData,
    })

    return {
        inventorySummary,
        isPending,
        isError,
    }
};

export default useInventorySummary;

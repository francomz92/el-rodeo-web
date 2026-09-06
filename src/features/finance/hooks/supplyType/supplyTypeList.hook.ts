import { useQuery } from "@tanstack/react-query";

import supplyTypeListQueryKey from "./queryKeys";
import { supplyTypeAPI } from "../../services/api";

const useSupplyTypeList = () => {
    const {
        data: supplyTypeList,
        isPending,
        error,
    } = useQuery({
        queryKey: supplyTypeListQueryKey.lists(),
        queryFn: () => supplyTypeAPI.getList(),
        placeholderData: (previousData) => previousData,
    })

    return {
        supplyTypeList,
        isPending,
        error,
    }
};

export default useSupplyTypeList;

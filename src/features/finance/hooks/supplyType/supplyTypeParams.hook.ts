import { useQuery } from "@tanstack/react-query";

import supplyTypeQueryKeys from "./queryKeys";
import { supplyTypeAPI } from "../../services/api";

/**
 * Unpaginated supply-type reference list for dropdowns, backed by
 * GET /finance/params/animal-supply-type (S4/S5 — never truncated).
 */
const useSupplyTypeParams = () => {
    const {
        data: supplyTypeParams,
        isPending,
        isSuccess,
        error,
    } = useQuery({
        queryKey: supplyTypeQueryKeys.params(),
        queryFn: () => supplyTypeAPI.getParams(),
    })

    return {
        supplyTypeParams,
        isPending,
        isSuccess,
        error,
    }
};

export default useSupplyTypeParams;

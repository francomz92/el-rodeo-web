import { useQuery } from "@tanstack/react-query";

import supplyQueryKeys from "./queryKeys";
import { supplyAPI } from "../../services/api";

/**
 * Unpaginated supply reference list for dropdowns, backed by
 * GET /finance/params/animal-supply (S4/S5 — never truncated by pagination).
 */
const useSupplyParams = () => {
    const {
        data: supplyParams,
        isPending,
        isSuccess,
        error,
    } = useQuery({
        queryKey: supplyQueryKeys.params(),
        queryFn: () => supplyAPI.getParams(),
    })

    return {
        supplyParams,
        isPending,
        isSuccess,
        error,
    }
};

export default useSupplyParams;

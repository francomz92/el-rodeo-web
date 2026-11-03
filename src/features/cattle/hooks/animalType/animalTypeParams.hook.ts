import { useQuery } from "@tanstack/react-query";

import animalTypeQueryKeys from "./queryKeys";
import { animalTypeAPI } from "../../services/api";

/**
 * Unpaginated animal-type reference list for dropdowns, backed by
 * GET /cattle/params/animal-type (S4/S5 — never truncated by pagination).
 */
const useAnimalTypeParams = () => {
    const {
        data: animalTypeParams,
        isPending,
        isSuccess,
        error,
    } = useQuery({
        queryKey: animalTypeQueryKeys.params(),
        queryFn: () => animalTypeAPI.getParams(),
    })

    return {
        animalTypeParams,
        isPending,
        isSuccess,
        error,
    }
};

export default useAnimalTypeParams;

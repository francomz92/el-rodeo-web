import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs"

import animalTypeQueryKeys from "./queryKeys";
import { animalTypeAPI } from "../../services/api";
import { AnimalTypeQueryParamsSchema } from "../../schemas/input/animalType.schemas";


const useAnimalTypeList = () => {
    const [queryParams, setQueryParams] = useQueryStates(AnimalTypeQueryParamsSchema);

    const {
        data: animalTypeList,
        isPending,
        isSuccess,
        error,
    } = useQuery({
        queryKey: animalTypeQueryKeys.list(queryParams),
        queryFn: () => animalTypeAPI.getList(queryParams),
    })

    return {
        animalTypeList,
        isPending,
        isSuccess,
        error,
        queryParams,
        setQueryParams,
    }
};

export default useAnimalTypeList;

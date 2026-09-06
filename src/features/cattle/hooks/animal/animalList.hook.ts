import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import animalQueryKeys from "./queryKeys";
import { animalAPI } from "../../services/api";
import { AnimalListQueryParamsSchema } from "../../schemas/input/animal.schemas";


const useAnimalList = () => {
    const [queryParams, setQueryParams] = useQueryStates(AnimalListQueryParamsSchema);

    const {
        data: animalList,
        isPending,
        isSuccess,
        isError,
    } = useQuery({
        queryKey: animalQueryKeys.list(queryParams),
        queryFn: () => animalAPI.getList(queryParams),
        placeholderData: (previousData) => previousData,
    })

    return {
        animalList,
        isLoading: isPending,
        isSuccess,
        isError,
        queryParams,
        setQueryParams,
    }
};

export default useAnimalList;

import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";

import animalScheduleEventQueryKeys from "./queryKeys";
import { animalScheduleEventAPI } from "../../services/api";
import { AnimalScheduleEventQueryParamsSchema } from "../../schemas/input/animalScheduleEvents.schemas";

const useAnimalScheduleEventList = () => {
    const [queryParams, setQueryParams] = useQueryStates(AnimalScheduleEventQueryParamsSchema);

    const {
        data: animalScheduleEventList,
        isPending,
        isSuccess,
        error,
    } = useQuery({
        queryKey: animalScheduleEventQueryKeys.list(queryParams),
        queryFn: () => animalScheduleEventAPI.getList(queryParams),
        placeholderData: (previousData) => previousData,
        enabled:
            Boolean(queryParams.start) ||
            Boolean(queryParams.end) ||
            Boolean(queryParams.title) ||
            Boolean(queryParams.pending) ||
            Boolean(queryParams.participants?.length),
    });

    return {
        animalScheduleEventList,
        isPending,
        isSuccess,
        error,
        queryParams,
        setQueryParams,
    };
};

export default useAnimalScheduleEventList;

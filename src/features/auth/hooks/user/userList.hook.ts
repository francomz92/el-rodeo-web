import { useQuery } from "@tanstack/react-query";
import { useQueryStates} from "nuqs"

import userQueryKeys from "./queryKeys"
import { userAPI } from "../../services/api";
import { UserListQueryParamsSchema } from "../../schemas/input/user.schemas";


const useUserList = (initialFetch = true) => {
    const [queryParams, setQueryParams] = useQueryStates(UserListQueryParamsSchema)

    const {
        data: usersList,
        isPending: usersListIsPending,
        error: usersListError,
    } = useQuery({
        queryKey: userQueryKeys.list(queryParams),
        queryFn: async () => userAPI.getList(queryParams),
        placeholderData: (previousData) => previousData,
        enabled: initialFetch,
    });

    return {
        usersList,
        usersListIsPending,
        usersListError,
        queryParams,
        setQueryParams,
    };
};

export default useUserList;

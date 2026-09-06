import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@hooks/index";

import userQueryKeys from "./queryKeys";
import { userAPI } from "../../services/api";
import type { UserRoleUpdateType } from "../../schemas/input/user.schemas";
import type { ErrorResponseType } from "../../../shared/schemas/output/responses.schemas";


const useUser = () => {
    const queryClient = useQueryClient();
    const { userId } = useParams<{ userId: string }>()
    const toast = useToast()

    const {
        data: userData,
        isPending,
        isSuccess,
        error,
    } = useQuery({
        queryKey: userQueryKeys.detail(userId!),
        queryFn: () => userAPI.getById(userId!),
        enabled: Boolean(userId),
    });

    const updateRoleMutation = useMutation({
        mutationFn: (data: UserRoleUpdateType) => userAPI.updateRole(userId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(userId) });
            queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            return userAPI.delete(userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        },
    });

    return {
        userData,
        isPending,
        isSuccess,
        error,
        updateRole: updateRoleMutation.mutate,
        isUpdatingRole: updateRoleMutation.isPending,
        roleUpdateError: updateRoleMutation.error,
        roleUpdateIsSuccess: updateRoleMutation.isSuccess,
        delete: deleteUserMutation.mutate,
        isDeleting: deleteUserMutation.isPending,
        deleteIsSuccess: deleteUserMutation.isSuccess,
        deleteError: deleteUserMutation.error,
    }
}

export default useUser;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@hooks/index";

import { userAPI } from "../../services/api";
import profileQueryKeys from "./queryKeys";
import type { PasswordChangeType, UserMeType } from "../../schemas/input/user.schemas";
import type { ErrorResponseType } from "../../../shared/schemas/output/responses.schemas";

const useProfile = () => {
    const queryClient = useQueryClient();
    const toast = useToast()

    const {
        data: user,
        isLoading,
        isSuccess,
        error,
    } = useQuery({
        queryKey: profileQueryKeys.me,
        queryFn: () => userAPI.getProfile(),
    });

    const {
        data: userTenant,
        isLoading: isLoadingTenant,
        isSuccess: isSuccessTenant,
        error: errorTenant,
    } = useQuery({
        queryKey: profileQueryKeys.myTenant,
        queryFn: () => userAPI.getMyTenant(),
    })

    const updateProfileMutation = useMutation({
        mutationFn: (data: UserMeType) => userAPI.editProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileQueryKeys.me });
            toast.success("Perfil actualizado correctamente");
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!);
            }
        },
    });

    const changePassword = useMutation({
        mutationFn: (data: PasswordChangeType) => userAPI.changePassword(data),
        onSuccess: ({ message }) => {
            toast.success(message);
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!);
            }
        },
    });

    return {
        user,
        isLoading,
        isSuccess,
        error,
        update: updateProfileMutation.mutate,
        isUpdating: updateProfileMutation.isPending,
        updateIsSuccess: updateProfileMutation.isSuccess,
        updateError: updateProfileMutation.error,
        changePassword: changePassword.mutate,
        isChangingPassword: changePassword.isPending,
        changePasswordIsSuccess: changePassword.isSuccess,
        changePasswordError: changePassword.error,
        userTenant,
        isLoadingTenant,
        isSuccessTenant,
        errorTenant,
    };
};

export default useProfile;

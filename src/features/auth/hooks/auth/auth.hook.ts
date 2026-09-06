import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@hooks/index";

import { authAPI } from "../../services/api";
import type { LoginType, RegisterInviteType } from "../../schemas/input/authentication.schemas";
import type { ErrorResponseType } from "../../../shared/schemas/output/responses.schemas";

const useAuth = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    const loginMutation = useMutation({
        mutationFn: (data: LoginType) => authAPI.logIn(data),
        onSuccess: ({ message }) => {
            toast.success(message);
            navigate("/", { replace: true });
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => authAPI.logOut(),
        onSuccess: () => {
            queryClient.removeQueries();
            navigate("/login", { state: { from: location }, replace: true });
        },
    });

    const inviteMutation = useMutation({
        mutationFn: (data: RegisterInviteType) => authAPI.inviteToTenant(data),
        onSuccess: () => {
            toast.success("Usuario invitado correctamente");
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        },
    });

    return {
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        logout: logoutMutation.mutate,
        inviteToTenant: inviteMutation.mutate,
        isInviting: inviteMutation.isPending,
        inviteError: inviteMutation.error,
    };
};

export default useAuth;

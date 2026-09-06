import { useMutation } from "@tanstack/react-query"

import { useToast } from "@hooks/index";

import { userAPI } from "../../services/api";
import type { ErrorResponseType } from "../../../shared/schemas/output/responses.schemas";

const useUserData = () => {
    const toast = useToast()

    const exportDataMutation = useMutation({
        mutationFn: () => userAPI.exportData(),
        onError: (error: ErrorResponseType) => {
            let message = "Error al exportar su información"
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                message = error?.error?.message!;
            }
            toast.error(message);
        },
    })

    const deleteDataMutation = useMutation({
        mutationFn: () => userAPI.deleteData(),
        onError: (error: ErrorResponseType) => {
            let message = "Error al eliminar su información"
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                message = error?.error?.message!;
            }
            toast.error(message);
        },
    })

    return {
        exportData: exportDataMutation.mutate,
        isExportingData: exportDataMutation.isPending,
        exportDataIsSuccess: exportDataMutation.isSuccess,
        exportDataError: exportDataMutation.error,
        deleteData: deleteDataMutation.mutate,
        isDeletingData: deleteDataMutation.isPending,
        deleteDataIsSuccess: deleteDataMutation.isSuccess,
        deleteDataError: deleteDataMutation.error,
    }
}

export default useUserData;

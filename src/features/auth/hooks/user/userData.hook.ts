import { useMutation } from "@tanstack/react-query"

import { useToast } from "@hooks/index";

import { userAPI } from "../../services/api";
import type { ErrorResponseType } from "../../../shared/schemas/output/responses.schemas";
import { notifyApiError } from "@shared/utils/errors.utils";

const useUserData = () => {
    const toast = useToast()

    const exportDataMutation = useMutation({
        mutationFn: () => userAPI.exportData(),
        onError: (error: ErrorResponseType) => notifyApiError(toast, error, "Error al exportar su información"),
    })

    return {
        exportData: exportDataMutation.mutate,
        isExportingData: exportDataMutation.isPending,
        exportDataIsSuccess: exportDataMutation.isSuccess,
        exportDataError: exportDataMutation.error,
    }
}

export default useUserData;

import { useMutation } from "@tanstack/react-query"

import { useToast } from "@hooks/index"
import { saveBlob } from "@shared/utils/download.utils"
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas"

import { reportsAPI } from "../../services/api"
import type { ReportCatalogEntry } from "../../reportCatalog"
import type { ReportFormat } from "../../schemas/output/reports"

interface ReportGenerationInput {
    filters: Record<string, string>;
    format: ReportFormat;
}

const useReportDownload = (report: ReportCatalogEntry) => {
    const toast = useToast()

    const generationMutation = useMutation({
        mutationFn: (input: ReportGenerationInput) =>
            reportsAPI.exportReport(report, input.filters, input.format),
        onSuccess: ({ blob, filename }, { format, filters }) => {
            const filterSuffix = Object.values(filters).filter(Boolean).join("-")
            const fallback = filterSuffix
                ? `report-${report.id}-${filterSuffix}.${format}`
                : `report-${report.id}.${format}`
            saveBlob(blob, filename ?? fallback)
            toast.success("Reporte generado correctamente.")
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && error?.error?.message) {
                toast.error(error.error.message)
            }
        },
    })

    return {
        generate: generationMutation.mutate,
        isGenerating: generationMutation.isPending,
        generationError: generationMutation.error as ErrorResponseType | null,
        resetGenerationError: generationMutation.reset,
    }
}

export default useReportDownload

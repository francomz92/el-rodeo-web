import { useState } from "react"

import DateTimePicker from "@components/DateTimePicker.component"
import { cn } from "@lib/utils/cssStyle.lib"
import { Button } from "@components/ui/button"
import { Field, FieldLabel } from "@components/ui/field"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog"

import { localTodayMidnight, parseYmdToLocalDate, toYmdString } from "@shared/utils/dates.utils"

import { useReportDownload } from "../../../hooks/download"
import {
    SalesReportFiltersValidationSchema,
    type SalesReportFiltersType,
} from "../../../schemas/input/report.schemas"
import type { ReportCatalogEntry } from "../../../reportCatalog"
import type { ReportFormat } from "../../../schemas/output/reports"

// Filter values stay YYYY-MM-DD strings (single source of truth); parsing and
// formatting live in @shared/utils/dates.utils.

// Sensible default: last 30 days, local midnight.
const buildInitialFilters = (): SalesReportFiltersType => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    return {
        from_date: toYmdString(from),
        to_date: toYmdString(to),
    };
};

const FORMAT_LABELS: Record<ReportFormat, string> = {
    pdf: "PDF",
    xlsx: "Excel",
};

interface ReportParamsDialogProps {
    entry: ReportCatalogEntry;
    onClose: () => void;
}

const ReportParamsDialog: React.FC<ReportParamsDialogProps> = ({ entry, onClose }) => {
    const { generate, isGenerating, generationError } = useReportDownload(entry)
    const [filters, setFilters] = useState<SalesReportFiltersType>(buildInitialFilters)
    const [format, setFormat] = useState<ReportFormat>(entry.formats[0] ?? "pdf")
    const [validationError, setValidationError] = useState<string | null>(null)

    const Icon = entry.icon

    const generateReport = () => {
        const result = SalesReportFiltersValidationSchema.safeParse({
            from_date: filters.from_date,
            to_date: filters.to_date,
        });

        if (!result.success) {
            setValidationError(result.error.issues[0]?.message ?? "Rango de fechas inválido");
            return;
        }

        setValidationError(null);
        generate(
            { filters: result.data, format },
            // Close only on success so failures stay visible in the dialog.
            { onSuccess: () => onClose() },
        );
    };

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="rounded-xl sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon className="size-5 text-primary" aria-hidden="true" />
                        {entry.title}
                    </DialogTitle>
                    <DialogDescription>
                        Configurá el período y el formato del archivo, y generá tu reporte.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <Field className="gap-1.5">
                        <FieldLabel>Fecha de inicio</FieldLabel>
                        <DateTimePicker
                            value={parseYmdToLocalDate(filters.from_date) ?? localTodayMidnight()}
                            onChange={(date) => {
                                if (date) setFilters((prev) => ({ ...prev, from_date: toYmdString(date) }));
                            }}
                            placeholder="Desde"
                            disableTime
                            className={cn(
                                "bg-background border-input rounded-lg px-3 py-2 text-sm shadow-none",
                                "hover:cursor-pointer hover:bg-accent",
                            )}
                        />
                    </Field>
                    <Field className="gap-1.5">
                        <FieldLabel>Fecha de fin</FieldLabel>
                        <DateTimePicker
                            value={parseYmdToLocalDate(filters.to_date) ?? localTodayMidnight()}
                            onChange={(date) => {
                                if (date) setFilters((prev) => ({ ...prev, to_date: toYmdString(date) }));
                            }}
                            placeholder="Hasta"
                            disableTime
                            className={cn(
                                "bg-background border-input rounded-lg px-3 py-2 text-sm shadow-none",
                                "hover:cursor-pointer hover:bg-accent",
                            )}
                        />
                    </Field>
                    <Field className="gap-1.5">
                        <FieldLabel htmlFor={`report-${entry.id}-format`}>Formato</FieldLabel>
                        <div
                            id={`report-${entry.id}-format`}
                            role="group"
                            aria-label="Formato del archivo"
                            className="inline-flex w-max items-center gap-1 rounded-lg border border-border bg-card p-1"
                        >
                            {(["pdf", "xlsx"] as ReportFormat[]).map((candidate) => (
                                <Button
                                    key={candidate}
                                    type="button"
                                    size="sm"
                                    variant={format === candidate ? "default" : "ghost"}
                                    aria-pressed={format === candidate}
                                    disabled={!entry.formats.includes(candidate)}
                                    onClick={() => setFormat(candidate)}
                                    className="hover:cursor-pointer"
                                >
                                    {FORMAT_LABELS[candidate]}
                                </Button>
                            ))}
                        </div>
                    </Field>

                    {validationError && (
                        <p role="alert" className="text-sm text-destructive">
                            {validationError}
                        </p>
                    )}
                    {!validationError && generationError && (
                        <p role="alert" className="text-sm text-destructive">
                            No se pudo generar el reporte. Verificá el período e intentá de nuevo.
                        </p>
                    )}
                </div>

                <DialogFooter className="gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg hover:cursor-pointer"
                        onClick={onClose}
                        disabled={isGenerating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="rounded-lg hover:cursor-pointer"
                        onClick={generateReport}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Generando..." : "Generar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReportParamsDialog

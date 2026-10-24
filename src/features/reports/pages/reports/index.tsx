import { useState } from "react"

import { REPORT_CATALOG, type ReportCatalogEntry } from "@reports/reportCatalog"

import ReportCard from "./components/ReportCard"
import ReportParamsDialog from "./components/ReportParamsDialog"

const ReportsCatalogPage: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<ReportCatalogEntry | null>(null)

    return (
        <section aria-label="Informe" className="flex flex-col gap-6 sm:gap-8">
            <div className="grid gap-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Informe</h1>
                <p className="text-sm text-muted-foreground">
                    Generá y descargá los reportes de la explotación. Elegí un tipo de reporte y
                    configurá sus parámetros.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {REPORT_CATALOG.map((entry) => (
                    <ReportCard
                        key={entry.id}
                        entry={entry}
                        onGenerate={setSelectedReport}
                    />
                ))}
            </div>

            {selectedReport && (
                <ReportParamsDialog
                    entry={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </section>
    );
};

export default ReportsCatalogPage;

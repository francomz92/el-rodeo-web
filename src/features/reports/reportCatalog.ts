import { Boxes, TrendingUp, type LucideIcon } from "lucide-react";

import { REPORT_EXPORT_ENDPOINTS } from "./constants";
import type { ReportFormat, ReportParamKind } from "./schemas/output/reports";

export interface ReportCatalogEntry {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    /** False renders the card disabled with an "upcoming" badge (no fake UI). */
    available: boolean;
    /** Absolute API path of the export endpoint for downloadable reports. */
    endpoint: string | null;
    formats: ReportFormat[];
    paramKind: ReportParamKind;
}

/**
 * Config-driven catalog: every future report type is data, not UI.
 * The screen reads this list and never changes structurally.
 */
export const REPORT_CATALOG: ReportCatalogEntry[] = [
    {
        id: "sales-summary",
        title: "Reporte de Ventas",
        description: "Ingresos, cantidad de ventas, precio promedio por kilo y peso total agregados por semana y por mes.",
        icon: TrendingUp,
        available: true,
        endpoint: REPORT_EXPORT_ENDPOINTS.exportSalesSummary,
        formats: ["pdf", "xlsx"],
        paramKind: "date-range",
    },
    {
        id: "inventory-summary",
        title: "Reporte de Inventario",
        description: "Animales agrupados por estado y por tipo, con los totales de la explotación.",
        icon: Boxes,
        available: false,
        endpoint: null,
        formats: [],
        paramKind: "none",
    },
];

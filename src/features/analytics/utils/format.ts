import { formatDateTime } from "@shared/utils/dates.utils";

export const formatCurrencyARS = (value: number): string =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2,
    }).format(value);

export const formatGeneratedAt = (value?: string | null): string => {
    if (!value) {
        return "Fecha de actualización no disponible";
    }
    try {
        return `Actualizado: ${formatDateTime(value)}`;
    } catch {
        return "Fecha de actualización no disponible";
    }
};

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
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Fecha de actualización no disponible";
    }
    return `Actualizado: ${date.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h24",
    })}`;
};

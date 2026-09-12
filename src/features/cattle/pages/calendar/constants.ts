import type { EventLabelType, EventStatusType, EventStyle, EventTypeColorOptions } from "./types";


export const COLOR_EVENT_TYPE: Record<EventTypeColorOptions, EventStyle> = {
    default: {
        bgColorMuted: "event-tint-1",
        bgColor: "bg-chart-1!",
        borderColor: "border-chart-1!",
        beforeEventStyle: "border-l-4! border-l-chart-1!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-1),inset_0_4px_0_0_var(--chart-1)]!",
    },
    vacunacion: {
        bgColorMuted: "event-tint-1",
        bgColor: "bg-chart-1!",
        borderColor: "border-chart-1!",
        beforeEventStyle: "border-l-4! border-l-chart-1!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-1),inset_0_4px_0_0_var(--chart-1)]!",
    },
    remate: {
        bgColorMuted: "event-tint-2",
        bgColor: "bg-chart-2!",
        borderColor: "border-chart-2!",
        beforeEventStyle: "border-l-4! border-l-chart-2!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-2),inset_0_4px_0_0_var(--chart-2)]!",
    },
    reunion: {
        bgColorMuted: "event-tint-3",
        bgColor: "bg-chart-3!",
        borderColor: "border-chart-3!",
        beforeEventStyle: "border-l-4! border-l-chart-3!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-3),inset_0_4px_0_0_var(--chart-3)]!",
    },
    veterinario: {
        bgColorMuted: "event-tint-3",
        bgColor: "bg-chart-3!",
        borderColor: "border-chart-3!",
        beforeEventStyle: "border-l-4! border-l-chart-3!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-3),inset_0_4px_0_0_var(--chart-3)]!",
    },
    pesaje: {
        bgColorMuted: "event-tint-4",
        bgColor: "bg-chart-4!",
        borderColor: "border-chart-4!",
        beforeEventStyle: "border-l-4! border-l-chart-4!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-4),inset_0_4px_0_0_var(--chart-4)]!",
    },
    marcado: {
        bgColorMuted: "event-tint-4",
        bgColor: "bg-chart-4!",
        borderColor: "border-chart-4!",
        beforeEventStyle: "border-l-4! border-l-chart-4!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-4),inset_0_4px_0_0_var(--chart-4)]!",
    },
    desparasitacion: {
        bgColorMuted: "event-tint-1",
        bgColor: "bg-chart-1!",
        borderColor: "border-chart-1!",
        beforeEventStyle: "border-l-4! border-l-chart-1!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-1),inset_0_4px_0_0_var(--chart-1)]!",
    },
    transporte: {
        bgColorMuted: "event-tint-4",
        bgColor: "bg-chart-4!",
        borderColor: "border-chart-4!",
        beforeEventStyle: "border-l-4! border-l-chart-4!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--chart-4),inset_0_4px_0_0_var(--chart-4)]!",
    },
    otro: {
        bgColorMuted: "bg-muted!",
        bgColor: "bg-muted-foreground!",
        borderColor: "border-muted-foreground!",
        beforeEventStyle: "border-l-4! border-l-muted-foreground!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--muted-foreground),inset_0_4px_0_0_var(--muted-foreground)]!",
    },
};

export const EVENT_STATUS_CONFIG: Record<"pending" | "completed", { label: string; className: string }> = {
    pending: { label: "Pendiente", className: "badge-role badge-role-warn" },
    completed: { label: "Completado", className: "badge-role badge-role-ok" },
};

export const EVENT_TYPE_LABELS: Record<EventLabelType, string> = {
    vacunacion: "vacunacion",
    remate: "remate",
    reunion: "reunion",
    veterinario: "veterinario",
    pesaje: "pesaje",
    marcado: "marcado",
    desparasitacion: "desparasitacion",
    transporte: "transporte",
    otro: "otro",
}

export const EVENT_STATUS_LABELS: Record<EventStatusType, string> = {
  pendiente: 'Pendiente',
  completado: 'Completado',
  // cancelado: 'Cancelado',
};

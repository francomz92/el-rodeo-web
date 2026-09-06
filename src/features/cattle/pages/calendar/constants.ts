import type { EventLabelType, EventStatusType, EventStyle, EventTypeColorOptions } from "./types";


export const COLOR_EVENT_TYPE: Record<EventTypeColorOptions, EventStyle> = {
    default: {
        bgColorMuted: "bg-(--green-muted)!",
        bgColor: "bg-(--fc-forma-event)!",
        borderColor: "border-(--fc-forma-event)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-forma-event)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-forma-event),inset_0_4px_0_0_var(--fc-forma-event)]!",
    },
    vacunacion: {
        bgColorMuted: "bg-(--blue-muted)!",
        bgColor: "bg-(--fc-vacunacion)!",
        borderColor: "border-(--fc-vacunacion)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-vacunacion)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-vacunacion),inset_0_4px_0_0_var(--fc-vacunacion)]!",
    },
    remate: {
        bgColorMuted: "bg-(--amber-muted)!",
        bgColor: "bg-(--fc-remate)!",
        borderColor: "border-(--fc-remate)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-remate)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-remate),inset_0_4px_0_0_var(--fc-remate)]!",
    },
    reunion: {
        bgColorMuted: "bg-(--violet-muted)!",
        bgColor: "bg-(--fc-reunion)!",
        borderColor: "border-(--fc-reunion)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-reunion)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-reunion),inset_0_4px_0_0_var(--fc-reunion)]!",
    },
    veterinario: {
        bgColorMuted: "bg-(--cyan-muted)!",
        bgColor: "bg-(--fc-veterinario)!",
        borderColor: "border-(--fc-veterinario)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-veterinario)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-veterinario),inset_0_4px_0_0_var(--fc-veterinario)]!",
    },
    pesaje: {
        bgColorMuted: "bg-(--slate-muted)!",
        bgColor: "bg-(--fc-pesaje)!",
        borderColor: "border-(--fc-pesaje)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-pesaje)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-pesaje),inset_0_4px_0_0_var(--fc-pesaje)]!",
    },
    marcado: {
        bgColorMuted: "bg-(--orange-muted)!",
        bgColor: "bg-(--fc-marcado)!",
        borderColor: "border-(--fc-marcado)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-marcado)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-marcado),inset_0_4px_0_0_var(--fc-marcado)]!",
    },
    desparasitacion: {
        bgColorMuted: "bg-(--lime-muted)!",
        bgColor: "bg-(--fc-desparasitacion)!",
        borderColor: "border-(--fc-desparasitacion)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-desparasitacion)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-desparasitacion),inset_0_4px_0_0_var(--fc-desparasitacion)]!",
    },
    transporte: {
        bgColorMuted: "bg-(--sky-muted)!",
        bgColor: "bg-(--fc-transporte)!",
        borderColor: "border-(--fc-transporte)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-transporte)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-transporte),inset_0_4px_0_0_var(--fc-transporte)]!",
    },
    otro: {
        bgColorMuted: "bg-(--gray-muted)!",
        bgColor: "bg-(--fc-otro)!",
        borderColor: "border-(--fc-otro)!",
        beforeEventStyle: "border-l-4! border-l-(--fc-otro)!",
        daysHeaderStyle: "shadow-[inset_0_0_0_1px_var(--fc-otro),inset_0_4px_0_0_var(--fc-otro)]!",
    },
};

export const EVENT_STATUS_CONFIG: Record<"pending" | "completed", { label: string; variant: "secondary" | "outline" }> = {
    pending: { label: "Pendiente", variant: "secondary" },
    completed: { label: "Completado", variant: "outline" },
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

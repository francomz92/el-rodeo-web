import { useState } from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@utils/cssStyle.lib";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";

import { EVENT_TYPE_LABELS, EVENT_STATUS_LABELS, COLOR_EVENT_TYPE } from "../constants";
import type { EventFilters, EventLabelType } from "../types";
import type { UserMeResponseSchema } from "@auth/schemas/output/user";
import { capitalize } from "@shared/utils/strings.utils";

interface CalendarFiltersProps {
    filters: Partial<EventFilters>;
    onFiltersChange: (filters: Partial<EventFilters>) => void;
    usersList: UserMeResponseSchema[];
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({ filters, onFiltersChange, usersList }) => {
    const [open, setOpen] = useState(false);

    const selectedParticipants = usersList?.filter((u) => filters.participants?.includes(u.id)) ?? [];
    const activeFiltersCount = Object.entries(filters).filter(
        ([k, v]) => ["pending", "type", "participants"].includes(k) && v !== null,
    ).length;

    const clearFilter = (key: keyof EventFilters) => {
        onFiltersChange({ ...filters, [key]: null });
    };

    const clearAll = () => {
        onFiltersChange({ type: null, pending: null, participants: null });
    };

    const handleFilterChange = (key: keyof EventFilters, value: string | boolean | null) => {
        let query = {
            [key]: value as EventFilters[keyof EventFilters],
        };
        if (key === "participants") {
            query["participants"] = [...(filters.participants || []), value as string];
        }
        onFiltersChange({ ...filters, ...query });
    };

    return (
        <>
            {/* Fila principal de filtros */}
            <div className="flex flex-wrap items-end gap-4">
                {/* 1. TIPO */}
                <div className="flex flex-col gap-1.5 min-w-40 p-4 border border-border rounded-xl bg-card">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo</label>
                    <Select value={capitalize(filters.type) || "Todos"} onValueChange={(v) => handleFilterChange("type", v)}>
                        <SelectTrigger className="w-full rounded-lg! h-11 hover:bg-input hover:cursor-pointer">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl! max-h-50!">
                            <SelectItem value={null} className="rounded-xl!">Todos</SelectItem>
                            {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key} className="rounded-xl!">
                                    {capitalize(label)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 2. PARTICIPANTES (Responsable) - COMBOBOX CON BÚSQUEDA */}
                <div className="flex flex-col gap-1.5 min-w-48 p-4 border border-border rounded-xl bg-card">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Participantes</label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger
                            role="combobox"
                            aria-expanded={open}
                            className="flex max-w-50 h-11 items-center justify-between gap-1.5 border border-input bg-background px-3 py-2 text-sm whitespace-nowrap outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 rounded-lg! hover:bg-input hover:cursor-pointer"
                        >
                            <span className="truncate">{selectedParticipants?.map((p) => p.name).join(", ") || "Todos"}</span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </PopoverTrigger>
                        <PopoverContent className="w-full max-w-60 p-0 rounded-xl! max-h-50!" align="start">
                            <Command>
                                <CommandInput placeholder="Buscar participante..." className="h-9 rounded-xl!" />
                                <CommandList>
                                    <CommandEmpty>No se encontró el participante.</CommandEmpty>
                                    <CommandGroup>
                                        {usersList.map((participante) => (
                                            <CommandItem
                                                key={participante.id}
                                                value={participante.name}
                                                onSelect={() => {
                                                    handleFilterChange("participants", participante.id);
                                                    setOpen(false);
                                                }}
                                                className="bg-input! rounded-lg!"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        filters.participants?.find((p) => p.includes(participante.id))
                                                            ? "opacity-100"
                                                            : "opacity-0",
                                                    )}
                                                />
                                                <span className="truncate">
                                                    {participante.name}
                                                </span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* 3. ESTADO */}
                <div className="flex flex-col gap-1.5 min-w-40 p-4 border border-border rounded-xl bg-card">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</label>
                    <Select
                        value={filters.pending === null ? "Todos" : filters.pending ? "Pendiente" : "Completado"}
                        onValueChange={(v) => handleFilterChange("pending", v)}
                    >
                        <SelectTrigger className="w-full rounded-lg! h-11 hover:bg-input hover:cursor-pointer">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl! max-h-50!">
                            <SelectItem value={null} className="rounded-lg!">Todos</SelectItem>
                            {Object.entries(EVENT_STATUS_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key === "pendiente"} className="rounded-lg!">
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 5. CONTADOR Y LIMPIAR */}
                <div className="flex items-center gap-2 ml-auto">
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="gap-1.5 rounded-md">
                            <span className="size-1.5 rounded-full bg-chart-1" />
                            {activeFiltersCount} filtro{activeFiltersCount !== 1 ? "s" : ""} activo{activeFiltersCount !== 1 ? "s" : ""}
                        </Badge>
                    )}

                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-foreground h-9">
                            Limpiar
                        </Button>
                    )}
                </div>
            </div>

            {/* TAGS DE FILTROS ACTIVOS */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-3">
                    {Boolean(filters.type) && (
                        <Badge
                            variant="outline"
                            className={cn("gap-1.5 px-3 py-1 font-semibold text-foreground h-10 border-none! rounded-md bg-input", COLOR_EVENT_TYPE[filters.type!].bgColorMuted)}
                        >
                            {capitalize(EVENT_TYPE_LABELS[filters.type as EventLabelType])}
                            <button
                                type="button"
                                onClick={() => clearFilter("type")}
                                className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
                                aria-label="Eliminar filtro de tipo"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}

                    {Boolean(filters?.participants?.length) && (
                        <Badge variant="outline" className="gap-1.5 px-3 max-w-50! py-1 font-semibold text-foreground h-10 border-none! rounded-md bg-muted">
                            <span className="truncate">{selectedParticipants?.map((p) => p.name).join(", ") ?? "Todos"}</span>
                            <button
                                type="button"
                                onClick={() => clearFilter("participants")}
                                className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
                                aria-label="Eliminar filtro de participante"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}

                    {filters.pending !== null && (
                        <Badge variant="outline" className="gap-1.5 px-3 py-1 font-semibold text-foreground h-10 border-none! rounded-md bg-muted">
                            {EVENT_STATUS_LABELS[filters.pending ? "pendiente" : "completado"]}
                            <button
                                type="button"
                                onClick={() => clearFilter("pending")}
                                className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
                                aria-label="Eliminar filtro de estado"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </>
    );
};

export default CalendarFilters;

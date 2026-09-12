import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import { CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Field, FieldDescription, FieldError, FieldLabel } from "@components/ui/field";
import { Separator } from "@components/ui/separator";
import {
    AnimalScheduleEventCreationValidationSchema,
    AnimalScheduleEventUpdateValidationSchema,
    type AnimalScheduleEventCreationType,
    type AnimalScheduleEventUpdateType,
} from "@cattle/schemas/input/animalScheduleEvents.schemas";
import DateTimePicker from "@components/DateTimePicker.component";
import useFormHook from "@hooks/form.hook";
import { useAnimalScheduleEvent } from "@cattle/hooks/animalScheduleEvent";
import { SearchInput, SelectInput, WaveSpinner } from "@components/index";
import type { AnimalScheduleEventResponseSchema, EventParticipant } from "@cattle/schemas/output/animalScheduleEvent";
import { mapErrors } from "@shared/utils/forms.utils";
import { AnimalEventTypes } from "@cattle/constants";
import useDebounce from "@hooks/debounce.hook";
import type { UserMeResponseSchema } from "@auth/schemas/output/user";

export interface EventFormProps {
    onClose: () => void;
    date: Date;
    changeDate: (date: Date) => void;
    eventToEdit?: AnimalScheduleEventResponseSchema;
    usersList: UserMeResponseSchema[]
}

export const EventForm: React.FC<EventFormProps> = ({ onClose, date, changeDate, eventToEdit, usersList }) => {
    const validationSchema = eventToEdit?.id ? AnimalScheduleEventUpdateValidationSchema : AnimalScheduleEventCreationValidationSchema;
    const { create, isCreating, update, isUpdating } = useAnimalScheduleEvent();
    const [userSearch, setUserSearch] = useState<string>();
    const [users, setUsers] = useState<UserMeResponseSchema[]>([])
    const form = useFormHook(validationSchema, { mode: "onChange" });
    const [startDate, setStartDate] = useState<Date>(date);
    const [endDate, setEndDate] = useState<Date>(eventToEdit?.id ? new Date(eventToEdit.end) : date);
    const [participants, setParticipants] = useState<EventParticipant[]>(eventToEdit?.participants ?? []);

    const userDebounced = useDebounce(userSearch, 300);

    useEffect(() => {
        if (!userDebounced) {
            setUsers([])
            return
        }
        setUsers(usersList?.filter(user => user.name.toLowerCase().includes(userDebounced.toLowerCase())))
    }, [userDebounced]);


    useEffect(() => {
        form.setValue(
            "participants",
            participants.map((p) => p.id),
        );
    }, [participants]);

    useEffect(() => {
        const initialData: Partial<AnimalScheduleEventCreationType> | Partial<AnimalScheduleEventUpdateType> = {
            start: date.toISOString(),
            description: "",
            type: "otro",
            participants: [],
        };
        if (eventToEdit?.id) {
            initialData.title = eventToEdit.title;
            initialData.description = eventToEdit.description;
            initialData.end = eventToEdit.end;
            initialData.type = eventToEdit.type;
            initialData.participants = eventToEdit.participants.map((p) => p.id);
        }
        form.reset(initialData);
        setStartDate(date);
        setEndDate(eventToEdit?.id ? new Date(eventToEdit.end) : date);
    }, [date]);

    const descriptionTrigger = form.watch("description");
    const typeTrigger = form.watch("type");

    const createEvent = (data: Record<string, unknown>) => {
        const payload = data as AnimalScheduleEventCreationType;
        create(payload, {
            onSuccess: () => {
                onClose();
                form.reset();
                changeDate(new Date(payload.start));
            },
            onError: (error) => {
                mapErrors({ form, error });
            },
        });
    };

    const updateEvent = (data: Record<string, unknown>) => {
        const payload = {
            eventId: eventToEdit!.id,
            data: data as AnimalScheduleEventUpdateType,
        };
        update(payload, {
            onSuccess: () => {
                changeDate(new Date(payload.data.start));
                form.reset();
                onClose();
            },
            onError: (error) => {
                mapErrors({ form, error });
            },
        });
    };

    const handleSubmit = (data: Record<string, unknown>) => {
        if (eventToEdit?.id) {
            return updateEvent(data);
        }
        return createEvent(data);
    };

    const onSelectType = (type: string) => {
        form.setValue("type", type, { shouldValidate: true });
    };

    const onSelectUser = (value: string, checked: boolean) => {
        setParticipants((prev) => {
            if (prev.find((p) => p.id === value && checked)) return prev;
            const participant = usersList.find((p) => p.id === value);
            if (!participant) return prev;
            if (!checked) return prev.filter((p) => p.id !== value);
            return [...prev, { id: participant.id, name: participant.name }];
        });
    };

    if (isCreating || isUpdating || !date || !usersList?.length) {
        return <WaveSpinner />;
    }

    return (
        <>
            <CardHeader className="space-y-0 pb-4! flex-col items-center">
                <div className="flex items-center gap-3 border! border-border rounded-xl! p-2">
                    <div className="h-8 w-1 rounded-full bg-chart-1" />
                    <div>
                        <h3 className="font-display text-2xl font-semibold tracking-wide text-foreground">{eventToEdit?.id ? "Modificar Evento" : "Crear Evento"}</h3>
                        <p className="text-sm text-muted-foreground">
                            {eventToEdit?.id ? "Actualiza" : "Completa"} los detalles del evento
                        </p>
                    </div>
                </div>
            </CardHeader>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
                <CardContent className="space-y-4">
                    {/* Title Field */}
                    <Field data-invalid={!!form.errors.title}>
                        <FieldLabel htmlFor="event-title">Título</FieldLabel>
                        <Input
                            id="event-title"
                            placeholder="Ej: Vacunación"
                            aria-invalid={!!form.errors.title}
                            disabled={isCreating || isUpdating}
                            {...form.register("title")}
                        />
                        <FieldDescription>Nombre del evento (máximo 50 caracteres)</FieldDescription>
                        {form.errors.title && <FieldError>{form.errors.title.message}</FieldError>}
                    </Field>

                    <Separator />

                    <Field>
                        <FieldLabel>Tipo</FieldLabel>
                        <SelectInput defaultValue={typeTrigger ?? "otro"} options={AnimalEventTypes} onValueChange={onSelectType} />
                        {form.errors.type && <FieldError>{form.errors.type.message}</FieldError>}
                    </Field>

                    <Separator />

                    <Field>
                        <FieldLabel>Participantes</FieldLabel>
                        {participants.length > 0 &&
                            <span
                                title={participants.map(p => p.name).join(", ") ?? ""}
                                className="border border-transparent rounded-lg bg-input/50 px-3 py-2 text-sm wrap-break-word! text-muted-foreground!"
                            >
                                {participants.map(p => p.name).join(", ") ?? ""}
                            </span>
                        }
                        <SearchInput
                            value={userSearch ?? ""}
                            placeholder="Buscar..."
                            onValueChange={setUserSearch}
                            className="bg-background border-input shadow-none"
                        />
                        {form.errors.participants && <FieldError>{form.errors.participants.message}</FieldError>}
                        {Boolean(users?.length) && users.map((u) => {
                            return (
                                <div className="flex gap-2" key={u.id}>
                                    <input
                                        className="w-4 accent-primary!"
                                        type="checkbox"
                                        value={u.id}
                                        placeholder={u.name}
                                        content={u.name}
                                        onChange={(e) => onSelectUser(e.target.value, e.target.checked)}
                                        checked={participants.find((p) => p.id === u.id) !== undefined}
                                    />
                                    <span className="truncate">{u.name}</span>
                                </div>
                            );
                        })}
                    </Field>

                    <Separator />

                    {/* Description Field */}
                    <Field data-invalid={!!form.errors.description}>
                        <FieldLabel htmlFor="event-description">Descripción (Opcional)</FieldLabel>
                        <Textarea
                            id="event-description"
                            placeholder="Describe el evento..."
                            aria-invalid={!!form.errors.description}
                            disabled={isCreating || isUpdating}
                            className="min-h-25 whitespace-pre-wrap wrap-break-word"
                            onKeyDown={(e) => {
                                if (e.currentTarget.value.length > 255) {
                                    e.currentTarget.value = e.currentTarget.value.slice(0, 256);
                                }
                            }}
                            {...form.register("description")}
                        />
                        <span className="text-muted-foreground">{255 - descriptionTrigger?.length} caracteres restantes</span>
                        {/*<FieldDescription>Detalles del evento (máximo 255 caracteres)</FieldDescription>*/}
                        {form.errors.description && <FieldError>{form.errors.description.message}</FieldError>}
                    </Field>

                    <Separator />

                    {/* Start Date/Time Field */}
                    <Field data-invalid={!!form.errors.start}>
                        <FieldLabel>Fecha y hora de inicio</FieldLabel>
                        <DateTimePicker
                            value={startDate}
                            onChange={(value) => {
                                setStartDate(value!);
                                form.setValue("start", value!.toISOString());
                            }}
                            placeholder="Seleccionar inicio"
                            disableDate={true}
                            disableTime={false}
                            disabled={isCreating || isUpdating}
                            className="hover:cursor-pointer active:scale-95"
                        />
                        {form.errors.start && <FieldError>{form.errors.start.message}</FieldError>}
                    </Field>

                    <Separator />

                    {/* End Date/Time Field */}
                    <Field data-invalid={!!form.errors.end}>
                        <FieldLabel>Fecha y hora de fin</FieldLabel>
                        <DateTimePicker
                            value={endDate}
                            onChange={(value) => {
                                setEndDate(value!);
                                form.setValue("end", value!.toISOString());
                            }}
                            placeholder="Seleccionar fin"
                            disableDate={true}
                            disableTime={false}
                            disabled={isCreating || isUpdating}
                            className="hover:cursor-pointer active:scale-95"
                        />
                        {form.errors.end && <FieldError>{form.errors.end.message}</FieldError>}
                    </Field>
                </CardContent>

                <CardFooter className="flex justify-center gap-2 pt-4">
                    {eventToEdit?.id && (
                        <Button
                            type="button"
                            onClick={onClose}
                            disabled={isCreating || isUpdating}
                            title="Cancelar"
                            className="flex-1"
                            variant="destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    <Button type="submit" disabled={isCreating || isUpdating} title="Guardar" className="flex-1" variant="outline">
                        <Save className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </form>
        </>
    );
};

export default EventForm;

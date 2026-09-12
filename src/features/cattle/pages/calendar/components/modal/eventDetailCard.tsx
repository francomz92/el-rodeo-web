import { useState } from "react";
import { Calendar, Clock, ShieldCheck, Users, FileText, Pencil, Trash2 } from "lucide-react";

import { cn } from "@utils/cssStyle.lib";
import { WaveSpinner } from "@components/index";
import { CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Separator } from "@components/ui/separator";
import { useAnimalScheduleEvent } from "@cattle/hooks/animalScheduleEvent";
import EventForm from "./eventForm";
import type { EventStyle, EventTypeColorOptions, ExtendedEventProps } from "../../types";
import { COLOR_EVENT_TYPE, EVENT_STATUS_CONFIG } from "../../constants";
import type { UserMeResponseSchema } from "@auth/schemas/output/user";
import { useProfile } from "@auth/hooks/profile";
import { PUBLIC_AUTH_ROLES } from "@auth/constants";

export interface EventDetailCardProps {
    event: ExtendedEventProps;
    onClose: () => void;
    changeDate: (date: Date) => void;
    usersList: UserMeResponseSchema[];
}

export const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, onClose, changeDate, usersList }) => {
    const { user } = useProfile();
    const { delete: deleteEvent, isDeleting } = useAnimalScheduleEvent();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const canWrite = user?.role !== PUBLIC_AUTH_ROLES.VIEWER;
    const statusConfig = event.pending ? EVENT_STATUS_CONFIG.pending : EVENT_STATUS_CONFIG.completed;
    const eventStyles: EventStyle = COLOR_EVENT_TYPE[event.type as EventTypeColorOptions];

    const eventDate = new Date(event.start);

    const toggleEdit = () => {
        if (isEditing) {
            onClose();
        }
        setIsEditing((prev) => !prev);
    };

    const onDelete = () => {
        deleteEvent(event.id, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (isDeleting) {
        return <WaveSpinner />;
    }

    if (isEditing) {
        return <EventForm onClose={toggleEdit} date={eventDate} changeDate={changeDate} eventToEdit={event} usersList={usersList} />;
    }

    return (
        <>
            <CardHeader className="space-y-0 pb-4! flex-col items-center">
                <div className="flex items-center gap-3 border border-border rounded-xl! p-2">
                    <div className={`h-8 w-1 rounded-full ${event.style.bgColor}`} />
                    <div>
                        <h3 className="font-display text-2xl font-semibold tracking-wide text-foreground">{event.title}</h3>
                        <Badge className={cn("mt-1 rounded-md", statusConfig.className)}>
                            {statusConfig.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 flex-col gap-2">
                {/* Date and Time */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                            {eventDate.toLocaleString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                            {new Date(event.start).toLocaleString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })} hs –{" "}
                            {new Date(event.end).toLocaleString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })} hs
                        </span>
                    </div>
                </div>

                <Separator />

                {/* Event Type */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Tipo de evento</span>
                    </div>
                    <div className="ml-7">
                        <Badge
                            variant="outline"
                            className={cn("rounded-md font-semibold text-foreground", eventStyles.bgColorMuted, eventStyles.borderColor)}
                        >
                            {event.type}
                        </Badge>
                    </div>
                </div>

                <Separator />

                {/* Participants */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Participantes</span>
                    </div>
                    <div className="ml-7 flex gap-2 items-center justify-start">
                        {event.participants.length !== 0 &&
                            event.participants.map((participant) => {
                                const splitedName = participant.name.split(" ").map((word) => word[0].toUpperCase());
                                return (
                                    <div key={participant.id} className="flex gap-2 items-center justify-start w-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-accent text-accent-foreground text-xs font-medium">
                                                {splitedName.join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium text-foreground truncate">{participant.name}</span>
                                    </div>
                                );
                            })}
                        {event.participants.length === 0 && <span className="font-mono text-xs text-muted-foreground">No hay</span>}
                    </div>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Descripción</span>
                    </div>
                    <div className="ml-7">
                        <p className="text-sm text-foreground">{event.description}</p>
                    </div>
                </div>

                <Separator />
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2 pt-4">
                {canWrite && (
                    <>
                        <Button variant="outline" className="flex-1" onClick={toggleEdit} title="Editar">
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={onDelete} title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </CardFooter>
        </>
    );
};

export default EventDetailCard;

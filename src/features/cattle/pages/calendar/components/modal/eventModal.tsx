import { EyeOff } from "lucide-react";

import { Card } from "@components/ui/card";
// import type { AnimalScheduleEventResponseSchema } from "@cattle/schemas/output/animalScheduleEvent";
import EventDetailCard from "./eventDetailCard";
import EventForm from "./eventForm";
import type { ExtendedEventProps } from "../../types";
import type { UserMeResponseSchema } from "@auth/schemas/output/user";

interface EventModalContentProps {
    events?: ExtendedEventProps[];
    date: Date | undefined;
    changeDate: (date: Date) => void;
    onClose: () => void;
    usersList: UserMeResponseSchema[];
}

const EventModalContent: React.FC<EventModalContentProps> = ({ events, date, changeDate, onClose, usersList }) => {
    const selectedEvent = events?.find((e) => e.selected);
    if (Boolean(events?.length) && !selectedEvent?.id) return null

    return (
        <div className="h-full lg:h-[76vh] lg:self-end lg:min-w-75 border rounded-xl p-2 px-8 lg:px-1 pb-8 pt-8 lg:pt-4 bg-(--fc-forma-background)">
            <div className="w-full text-center pb-2">
                <button onClick={onClose}>
                    <EyeOff className="cursor-pointer" size={16} />
                </button>
            </div>
            <Card className="lg:flex lg:justify-around w-full h-full shadow-none ring-0 overflow-y-auto scrollbar-thin bg-inherit">
                {/*INFO Cuando no hay eventos en la fecha seleccionada, se muestra el formulario de creación */}
                {!selectedEvent?.id && <EventForm date={date!} changeDate={changeDate} onClose={onClose} usersList={usersList} />}
                {/*INFO Cuando hay eventos pero no se selecciona uno en particular, se muestra la lista de eventos */}
                {/*{Boolean(events?.length) && !selectedEvent?.id && <div className="w-full text-center">Lista de eventos</div>}*/}
                {/*INFO: Cuando se selecciona un evento, se muestra el detalle del evento */}
                {selectedEvent?.id && (
                    <EventDetailCard event={selectedEvent} onClose={onClose} changeDate={changeDate} usersList={usersList} />
                )}
            </Card>
        </div>
    );
};

interface EvenModalProps extends EventModalContentProps {
    show: boolean;
}

const EventModal: React.FC<EvenModalProps> = ({ show, events, date, changeDate, onClose, usersList }) => {
    if (!show) return null;
    return <EventModalContent events={events} date={date} changeDate={changeDate} onClose={onClose} usersList={usersList} />;
};

export default EventModal;

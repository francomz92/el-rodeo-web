import { useEffect, useState } from "react";
import { CalendarClock, CalendarPlus } from "lucide-react";

import FullCalendar, { useCalendarController } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/forma";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import esLocale from "@fullcalendar/react/locales/es";

import "@fullcalendar/react/skeleton.css"; // ALWAYS NEED SKELETON
import "@fullcalendar/react/themes/forma/theme.css"; // YOUR THEME
import "@fullcalendar/react/themes/forma/palettes/green.css"; // YOUR THEME'S PALETTE

import "@assets/styles/calendar.css";
import { DateTimePicker, WaveSpinner } from "@components/index";
import { Badge } from "@components/ui/badge";
import { capitalize } from "@shared/utils/strings.utils";
import { useUserList } from "@auth/hooks/user";
import { useAnimalScheduleEventList } from "@cattle/hooks/animalScheduleEvent";

import { COLOR_EVENT_TYPE } from "./constants";
import type { EventDataInput, EventFilters, EventTypeColorOptions, ExtendedEventProps } from "./types";
import CalendarFilters from "./components/calendarFilters";
import { EventModal } from "./components";
import useThemeSchema from "../../../../layers/hooks/useThemeSchema.hook";

const Calendar: React.FC = () => {
    const { isDark } = useThemeSchema();
    const controller = useCalendarController();
    const { animalScheduleEventList: events, isPending, setQueryParams, queryParams } = useAnimalScheduleEventList();
    const { usersList, usersListIsPending } = useUserList();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedEvents, setSelectedEvents] = useState<ExtendedEventProps[]>([]);
    const [eventsData, setEventsData] = useState<EventDataInput[]>([]);

    useEffect(() => {
        if (!selectedDate) return;
        controller.gotoDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        setEventsData(
            events?.map((event) => ({
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                extendedProps: { ...event, style: COLOR_EVENT_TYPE[event.type as EventTypeColorOptions] },
                date: event.start,
            })) || [],
        );
    }, [events]);

    const handleModalDetails = (show: boolean, date: Date, events: ExtendedEventProps[]) => {
        setSelectedEvents(events);
        setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
        setShowModal(show);
    };

    const onCloseModal = () => {
        setSelectedDate(undefined);
        setSelectedEvents([]);
        setShowModal(false);
    };

    return (
        <section className={`relative flex flex-col gap-2 justify-center w-full h-full px-4 ${showModal ? "items-start" : "items-center"}`}>
            {(isPending || usersListIsPending) && <WaveSpinner />}
            <div className="lg:w-8/10 w-full">
                <CalendarFilters
                    onFiltersChange={setQueryParams}
                    filters={queryParams as Partial<EventFilters>}
                    usersList={usersList?.items || []}
                />
            </div>
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-2 lg:justify-center lg:items-center w-full">
                <FullCalendar
                    toolbarElements={{
                        datePicker: (_) => {
                            return (
                                <DateTimePicker
                                    value={selectedDate ?? new Date()}
                                    onChange={setSelectedDate}
                                    disableTime={true}
                                    className="border! border-border! p-2 text-sm rounded-sm text-primary! bg-(--fc-forma-background)! border-(--fc-forma-muted)! hover:cursor-pointer hover:bg-(--fc-forma-muted)! active:bg-(--fc-forma-strong)!"
                                />
                            );
                        },
                    }}
                    datesSet={(info) => setQueryParams({ start: info?.startStr, end: info?.endStr })}
                    events={eventsData}
                    controller={controller}
                    plugins={[themePlugin, dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin]}
                    headerToolbar={{
                        left: "today,prev,next datePicker",
                        // center: "title",
                        right: "timeGridWeek,dayGridMonth,multiMonthYear",
                    }}
                    initialView="timeGridWeek"
                    locale={esLocale}
                    timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                    todayText="Hoy"
                    listText="Día"
                    height="75vh"
                    className="lg:w-8/10 w-full"
                    colorScheme={isDark ? "dark" : "light"}
                    headerToolbarClass="border-none! px-0! py-6! bg-transparent!"
                    viewClass="border rounded-xl!"
                    buttonGroupClass="border rounded-t-sm! rounded-b-sm! text-gray-700! bg-(--fc-forma-background)! border-(--fc-forma-muted)!"
                    buttonClass={(info) => {
                        let baseClases = "border-none! rounded-none h-9 text-foreground! ";
                        if (!info.isSelected) {
                            return baseClases;
                        }
                        return baseClases + " text-gray-700! " + COLOR_EVENT_TYPE.default.bgColorMuted;
                    }}
                    dayCellTopClass={(info) => {
                        const toDayStyle =
                            info.date.toLocaleDateString() === new Date().toLocaleDateString()
                                ? `border-t-4! ${COLOR_EVENT_TYPE.default.borderColor}`
                                : "";
                        return "relative! " + toDayStyle;
                    }}
                    dayCellTopContent={(info) => {
                        return (
                            <div className="text-foreground!">
                                <span>{info.date.getDate()}</span>
                                {info.date.getMonth() === info.view.currentStart.getMonth() && (
                                    <CalendarPlus
                                        size={16}
                                        className="absolute top-2 right-2 hover:cursor-pointer hover:scale-110 active:scale-90 scale-0 group-hover:scale-100 delay-100 transition-transform"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleModalDetails(true, info.date, []);
                                        }}
                                    />
                                )}
                            </div>
                        );
                    }}
                    dayCellTopInnerClass="bg-transparent! text-foreground!"
                    dayCellClass="group"
                    eventDisplay="block"
                    eventClass={(info) => {
                        const event = info.event as unknown as EventDataInput;
                        let borderColor = event?.extendedProps?.style?.beforeEventStyle ?? COLOR_EVENT_TYPE.default.bgColor;
                        return `hover:cursor-pointer px-2 wrap-break-word! ${borderColor}`;
                    }}
                    eventInnerClass="text-gray-700!"
                    eventTimeClass="text-gray-700!"
                    eventContent={(info) => {
                        return (
                            <div className="flex! flex-col!">
                                <span className="text-[10px]">
                                    {info.event.start?.toLocaleString("es-AR", { hourCycle: "h24", timeStyle: "short" })}-
                                    {info.event.end?.toLocaleString("es-AR", { hourCycle: "h24", timeStyle: "short" })}
                                </span>
                                <span className="text-sm font-bold">{info.event.title}</span>
                            </div>
                        );
                    }}
                    eventDidMount={(info) => {
                        const description = info.event.extendedProps.description?.trim();
                        if (!description) return;
                        const tooltip = document.createElement("div");
                        tooltip.textContent = description;
                        tooltip.className = "fc-custom-tooltip";
                        document.body.appendChild(tooltip);
                        info.el.addEventListener("mouseenter", () => {
                            const rect = info.el.getBoundingClientRect();
                            tooltip.style.left = `${rect.right}px`;
                            tooltip.style.top = `${rect.top + rect.height / 2}px`;
                            tooltip.style.opacity = "1";
                        });
                        info.el.addEventListener("mouseleave", () => {
                            tooltip.style.opacity = "0";
                        });
                    }}
                    eventClick={(info) => {
                        const filteredEvents = eventsData?.filter((e) => {
                            return new Date(e.extendedProps.start).toISOString() === info.event.start?.toISOString();
                        });
                        const currentEvents =
                            filteredEvents?.map((event) => {
                                if (event.id === info.event.extendedProps.id) {
                                    return { ...event.extendedProps, selected: true };
                                }
                                return event.extendedProps;
                            }) || [];
                        handleModalDetails(true, new Date(info.event.startStr), currentEvents);
                    }}
                    blockEventClass={(info) => {
                        const event = info.event as unknown as EventDataInput;
                        return event.extendedProps.style.bgColorMuted;
                    }}
                    views={{
                        timeGridWeek: {
                            dayHeaderFormat: { weekday: "long", day: "2-digit" },
                            dayHeaderAlign: "center",
                            dayHeaderInnerClass: "text-wrap text-center",
                            dayHeaderClass: (info) => {
                                const firstEventOfDay = eventsData.find((event) => {
                                    return new Date(event.start).toLocaleDateString() === info.date.toLocaleDateString();
                                });
                                const daysHeaderStyle = firstEventOfDay?.extendedProps?.style?.daysHeaderStyle ?? "";
                                return `border-none! ${daysHeaderStyle}`;
                            },
                            dayHeaderContent(info) {
                                const toDayStyle = info.date.toDateString() === new Date().toDateString() ? " font-black" : ""
                                return (
                                    <div className={"flex flex-col gap-1 text-primary" + toDayStyle} >
                                        <span className="text-sm">{capitalize(info.weekdayText)}</span>
                                        <span className="text-md">{info.dayNumberText}</span>
                                    </div>
                                );
                            },
                            blockEventClass: "rounded-lg!",
                            slotHeaderInnerClass: "h-8",
                            allDaySlot: false,
                            slotHeaderAlign: "center",
                            slotMinTime: "6:00",
                            slotMaxTime: "20:00",
                            slotHeaderContent(info) {
                                return info.text + ":00";
                            },
                            eventInnerClass: "flex! items-center! justify-center!",
                            eventTimeFormat: {
                                hour: "2-digit",
                                minute: "2-digit",
                            },
                            eventContent: (info) => {
                                return (
                                    <div className="w-full text-start text-xs font-bold px-2">
                                        <span className="relative">
                                            <CalendarClock size={12} className="absolute inset-0 -left-4" />
                                            {info.event.title}
                                        </span>
                                        <Badge variant="outline" className="text-[10px] bg-white/30 p-2 text-gray-500!">
                                            {info.event.extendedProps.pending ? "Pendiente" : "Completado"}
                                        </Badge>
                                    </div>
                                );
                            },
                            dayLaneDidMount: (info) => {
                                info.el.onclick = (e) => {
                                    e.stopPropagation();
                                    handleModalDetails(true, info.date, []);
                                };
                            },
                            eventDidMount: (info) => {
                                info.el.onclick = (e) => {
                                    e.stopPropagation();
                                    const currentEvents = [{ ...(info.event.extendedProps as ExtendedEventProps), selected: true }];
                                    handleModalDetails(true, new Date(info.event.startStr), currentEvents);
                                };
                            },
                        },
                        dayGridMonth: {
                            dayHeaderAlign: "center",
                            dayHeaderClass: "border-none!",
                            dayHeaderContent(info) {
                                return capitalize(info.weekdayText)
                            },
                            eventTimeFormat: { hour: "2-digit", minute: "2-digit" },
                            dayMaxEvents: 1,
                        },
                        multiMonthYear: {
                            dayCellTopContent: (info) => {
                                return (
                                    <div className="text-foreground!">
                                        <span>{info.date.getDate()}</span>
                                        {!info.isDisabled && (
                                            <CalendarPlus
                                                size={10}
                                                className="absolute top-1.25 right-1 hover:cursor-pointer hover:scale-110 active:scale-90 scale-0 group-hover:scale-100 delay-100 transition-transform"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleModalDetails(true, info.date, []);
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            },
                            singleMonthTitleFormat: (info) => {
                                const month = new Date(info.start.year, info.start.month).toLocaleString("es-AR", { month: "long" });
                                return capitalize(month)
                            },
                        },
                    }}
                />
                <EventModal
                    show={showModal}
                    date={selectedDate}
                    changeDate={(date) => setSelectedDate(date)}
                    events={selectedEvents}
                    onClose={onCloseModal}
                    usersList={usersList?.items || []}
                />
            </div>
        </section>
    );
};
export default Calendar;

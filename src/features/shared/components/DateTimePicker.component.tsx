import { useState } from "react";

import { cn } from "@utils/cssStyle.lib";

import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface DateTimePickerProps {
    value: Date;
    onChange?: (date: Date) => void;
    placeholder?: string;
    disabled?: boolean;
    disableDate?: boolean;
    disableTime?: boolean;
    className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    value,
    onChange,
    placeholder = "Seleccionar fecha y hora",
    disabled = false,
    disableDate = false,
    disableTime = true,
    className,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
            <PopoverTrigger className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}>
                <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? (
                        !disableTime ? (
                            value.toLocaleString("es-AR", {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                        ) : (
                            value.toLocaleString("es-AR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    defaultMonth={value}
                    onSelect={(date: Date) => {
                        if (date) {
                            // Preserve the time if already set
                            if (value) {
                                date.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
                            }
                            onChange?.(date);
                        }
                        setOpen(false);
                    }}
                    required
                    disabled={disableDate || disabled}
                />
                {!disableTime && (
                    <div className="p-3 border-t">
                        <Input
                            type="time"
                            // value={value ? format(value, "HH:mm") : "00:00"}
                            value={value ? value.toLocaleString("es-AR", { hour12: false, hour: "2-digit", minute: "2-digit" }) : "00:00"}
                            onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                const newDate = value ? new Date(value) : new Date();
                                newDate.setHours(hours, minutes);
                                onChange?.(newDate);
                            }}
                            className="w-full"
                            disabled={disableTime || disabled}
                        />
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default DateTimePicker;

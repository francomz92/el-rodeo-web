import { Check, ChevronDown } from "lucide-react";
import { Select } from "@base-ui/react/select";

interface SelectInputProps {
    /** Controlled selection: either an option label or an option value. */
    value: string;
    onValueChange: (value: string) => void;
    options: Record<string, string>;
}

/**
 * Single point of label -> value resolution: callers keep working with labels,
 * Base UI compares against option values. Unknown input passes through, so a
 * raw option value still selects its own item.
 */
const resolveOptionValue = (value: string, options: Record<string, string>): string =>
    options[value] ?? value;

const SelectInput: React.FC<SelectInputProps> = ({ value, onValueChange, options }) => {
    const selectedValue = resolveOptionValue(value, options);
    const labelByValue = Object.fromEntries(
        Object.entries(options).map(([label, optionValue]) => [optionValue, label]),
    );

    return (
        <Select.Root value={selectedValue} onValueChange={(v) => onValueChange(v ?? "")}>
            <Select.Trigger className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-none outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:border-ring data-popup-open:bg-accent hover:cursor-pointer">
                {/* Base UI renders the raw value in the trigger unless a children
                    formatter resolves it: map the selected option value back to
                    its label, falling back to the raw value for unknown input. */}
                <Select.Value>
                    {(selected: string | null) =>
                        selected ? labelByValue[selected] ?? selected : value || "--"
                    }
                </Select.Value>
                <Select.Icon className="text-muted-foreground">
                    <ChevronDown className="size-4" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Positioner sideOffset={6} align="start" className="z-50 outline-none">
                    <Select.Popup className="max-h-80 min-w-(--anchor-width) overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md">
                        {Object.entries(options).map(([label, optionValue]) => (
                            <Select.Item
                                key={label}
                                value={optionValue}
                                className="relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pl-8 pr-2 text-sm outline-none data-highlightedbg-accent data-highlighted:bg-foreground data-highlighted:text-background data-selected:font-medium"
                            >
                                <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                                    <Check className="size-4" />
                                </Select.ItemIndicator>
                                <Select.ItemText>{label}</Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
};

export default SelectInput;

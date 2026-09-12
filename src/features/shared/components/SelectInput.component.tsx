import { Check, ChevronDown } from "lucide-react";
import { Select } from "@base-ui/react/select";

interface SelectInputProps {
    defaultValue: string;
    onValueChange: (value: string) => void;
    options: Record<string, string>;
}

const SelectInput: React.FC<SelectInputProps> = ({ defaultValue, onValueChange, options }) => {
    return (
        <Select.Root value={defaultValue} onValueChange={(v) => onValueChange(v ?? "")}>
            <Select.Trigger className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-none outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:border-ring data-popup-open:bg-accent hover:cursor-pointer">
                <Select.Value placeholder={defaultValue || "--"} />
                <Select.Icon className="text-muted-foreground">
                    <ChevronDown className="size-4" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Positioner sideOffset={6} align="start" className="z-50 outline-none">
                    <Select.Popup className="max-h-80 min-w-(--anchor-width) overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md">
                        {Object.entries(options).map(([key, value]) => (
                            <Select.Item
                                key={key}
                                value={value}
                                className="relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pl-8 pr-2 text-sm outline-none data-highlightedbg-accent data-highlighted:bg-foreground data-highlighted:text-background data-selected:font-medium"
                            >
                                <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                                    <Check className="size-4" />
                                </Select.ItemIndicator>
                                <Select.ItemText>{key}</Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
};

export default SelectInput;

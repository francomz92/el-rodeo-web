import { Search } from "lucide-react";

import { cn } from "@utils/cssStyle.lib"
import { Input } from "@components/ui/input";


interface SearchInputProps {
    value?: string;
    placeholder: string;
    onValueChange: (value: string) => void;
    className?: string;
}

const SearchInput = (props: SearchInputProps) => {
    return (
        <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder={props.placeholder}
                onChange={(e) => props.onValueChange(e.target.value)}
                className={cn("h-10 rounded-lg bg-muted/60 pl-9 shadow-none", props.className)}
                value={props.value}
            />
        </div>
    );
};

export default SearchInput;

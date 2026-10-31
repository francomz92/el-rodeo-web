import SelectInput from "./SelectInput.component";

/** Sentinel label of the "no filter" option injected into every filter select. */
const EMPTY_FILTER_VALUE = "Todos";

interface FilterSelectProps {
    /** Current filter param from the URL state; null or undefined means no filter. */
    value: string | null | undefined;
    /** Option labels mapped to their URL param values; the reset option is added here. */
    options: Record<string, string>;
    /** Receives the selected param value, or undefined when the reset option is chosen. */
    onValueChange: (value: string | undefined) => void;
}

/**
 * List-filter select on top of SelectInput. Owns the "Todos" reset sentinel so
 * pages never re-implement it: the displayed label derives from the current URL
 * param (SelectInput maps values back to labels) and the change handler
 * normalizes the sentinel to undefined. Pages pair it with their nuqs
 * setQueryParams and reset pagination there.
 */
const FilterSelect: React.FC<FilterSelectProps> = ({ value, onValueChange, options }) => {
    const handleChange = (selected: string) => {
        onValueChange(!selected || selected === EMPTY_FILTER_VALUE ? undefined : selected);
    };

    return (
        <SelectInput
            value={value ?? EMPTY_FILTER_VALUE}
            onValueChange={handleChange}
            options={{ [EMPTY_FILTER_VALUE]: "", ...options }}
        />
    );
};

export default FilterSelect;

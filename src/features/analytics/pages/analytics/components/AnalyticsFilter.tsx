import { useState } from "react";

import DateTimePicker from "@components/DateTimePicker.component";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { AnalyticsRangeValidationSchema } from "@analytics/schemas/input/analytics.schemas";
import { localTodayMidnight, parseYmdToLocalDate, toYmdString } from "@shared/utils/dates.utils";

type AnalyticsFilterValues = {
    from_date: string | null;
    to_date: string | null;
};

type AnalyticsFilterProps = {
    queryParams: AnalyticsFilterValues;
    setQueryParams: (values: AnalyticsFilterValues) => void;
};

// Filter values stay YYYY-MM-DD strings (single source of truth); parsing and
// formatting live in @shared/utils/dates.utils.

const AnalyticsFilter: React.FC<AnalyticsFilterProps> = ({ queryParams, setQueryParams }) => {
    const [fromDate, setFromDate] = useState(queryParams.from_date ?? "");
    const [toDate, setToDate] = useState(queryParams.to_date ?? "");
    const [validationError, setValidationError] = useState<string | null>(null);

    const applyFilters = () => {
        const result = AnalyticsRangeValidationSchema.safeParse({
            from_date: fromDate,
            to_date: toDate,
        });

        if (!result.success) {
            setValidationError(result.error.issues[0]?.message ?? "Rango de fechas inválido");
            return;
        }

        setValidationError(null);
        setQueryParams({ from_date: fromDate, to_date: toDate });
    };

    return (
        <div className="grid gap-4 sm:w-max sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="grid gap-1.5 border border-border rounded-xl p-4 bg-card">
                <Label>Fecha de inicio</Label>
                <DateTimePicker
                    value={parseYmdToLocalDate(fromDate) ?? localTodayMidnight()}
                    onChange={(date) => {
                        if (date) setFromDate(toYmdString(date));
                    }}
                    placeholder="Desde"
                    disableTime
                    className="bg-background border-input rounded-lg px-3 py-2 text-sm shadow-none hover:cursor-pointer hover:bg-accent"
                />
            </div>
            <div className="grid gap-1.5 border border-border rounded-xl p-4 bg-card">
                <Label>Fecha de fin</Label>
                <DateTimePicker
                    value={parseYmdToLocalDate(toDate) ?? localTodayMidnight()}
                    onChange={(date) => {
                        if (date) setToDate(toYmdString(date));
                    }}
                    placeholder="Hasta"
                    disableTime
                    className="bg-background border-input rounded-lg px-3 py-2 text-sm shadow-none hover:cursor-pointer hover:bg-accent"
                />
            </div>
            <div className="grid gap-1.5 content-end pb-0.5">
                <Button
                    type="button"
                    onClick={applyFilters}
                    className="hover:cursor-pointer rounded-lg h-10 px-5"
                >
                    Aplicar filtros
                </Button>
            </div>
            {validationError && (
                <p role="alert" className="text-sm text-destructive sm:col-span-3">
                    {validationError}
                </p>
            )}
        </div>
    );
};

export default AnalyticsFilter;

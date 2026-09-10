import { useState } from "react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { AnalyticsRangeValidationSchema } from "@analytics/schemas/input/analytics.schemas";


type AnalyticsFilterValues = {
    from_date: string | null;
    to_date: string | null;
};

type AnalyticsFilterProps = {
    queryParams: AnalyticsFilterValues;
    setQueryParams: (values: AnalyticsFilterValues) => void;
};

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
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="grid gap-1.5">
                <Label htmlFor="analytics-from-date">Fecha de inicio</Label>
                <Input
                    id="analytics-from-date"
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    className="bg-background"
                />
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="analytics-to-date">Fecha de fin</Label>
                <Input
                    id="analytics-to-date"
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    className="bg-background"
                />
            </div>
            <Button type="button" onClick={applyFilters}>
                Aplicar filtros
            </Button>
            {validationError && (
                <p role="alert" className="text-sm text-destructive sm:col-span-3">
                    {validationError}
                </p>
            )}
        </div>
    );
};

export default AnalyticsFilter;

import { useEffect, useRef, useState } from "react";

import { Button } from "@components/ui/button";
import useInventorySummary from "@analytics/hooks/inventory/inventorySummary.hook";
import useSalesSummary from "@analytics/hooks/sales/salesSummary.hook";
import { resolveGranularity, selectSalesSeries } from "@analytics/utils/granularity";

import AnalyticsFilter from "./components/AnalyticsFilter";
import InventoryDoughnut from "./components/InventoryDoughnut";
import KpiCards from "./components/KpiCards";
import SalesTrend, { type SalesChartType, type SalesTrendPoint } from "./components/SalesTrend";


type PeriodLike = {
    week_start?: string | null;
    month_start?: string | null;
    revenue: number;
    sales_count: number;
};

const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

const AnalyticsPage: React.FC = () => {
    const { inventorySummary, isPending: inventoryIsPending, isError: inventoryIsError } =
        useInventorySummary();
    const {
        salesSummary,
        isPending: salesIsPending,
        isError: salesIsError,
        queryParams,
        setQueryParams,
    } = useSalesSummary();

    const [chartType, setChartType] = useState<SalesChartType>("line");

    const defaultsApplied = useRef(false);
    useEffect(() => {
        if (defaultsApplied.current) {
            return;
        }
        defaultsApplied.current = true;
        if (!queryParams.from_date && !queryParams.to_date) {
            const to = new Date();
            const from = new Date();
            from.setMonth(from.getMonth() - 12);
            setQueryParams({ from_date: toISODate(from), to_date: toISODate(to) });
        }
    }, [queryParams.from_date, queryParams.to_date, setQueryParams]);

    const granularity = resolveGranularity(queryParams.from_date, queryParams.to_date);
    const granularityLabel = granularity === "weekly" ? "Semanal" : "Mensual";

    const series = (selectSalesSeries(salesSummary?.data, granularity) ?? []) as PeriodLike[];
    const points: SalesTrendPoint[] = series.map((period) => ({
        label: period.week_start ?? period.month_start ?? "Período sin fecha",
        revenue: period.revenue,
        sales_count: period.sales_count,
    }));

    return (
        <section aria-label="Analíticas" className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold">Analíticas</h1>
                    <p className="text-muted-foreground">
                        Inventario actual y evolución de las ventas.
                    </p>
                </div>
                <div className="flex gap-2" role="group" aria-label="Tipo de gráfico de ventas">
                    <Button
                        type="button"
                        variant={chartType === "line" ? "default" : "outline"}
                        aria-pressed={chartType === "line"}
                        onClick={() => setChartType("line")}
                    >
                        Líneas
                    </Button>
                    <Button
                        type="button"
                        variant={chartType === "bar" ? "default" : "outline"}
                        aria-pressed={chartType === "bar"}
                        onClick={() => setChartType("bar")}
                    >
                        Barras
                    </Button>
                </div>
            </div>

            <AnalyticsFilter queryParams={queryParams} setQueryParams={setQueryParams} />

            <KpiCards total={salesSummary?.data.total} />

            <div className="grid gap-6 lg:grid-cols-2">
                <InventoryDoughnut
                    data={inventorySummary?.data}
                    isPending={inventoryIsPending}
                    isError={inventoryIsError}
                    generatedAt={inventorySummary?.generated_at ?? undefined}
                />
                <SalesTrend
                    points={points}
                    chartType={chartType}
                    isPending={salesIsPending}
                    isError={salesIsError}
                    generatedAt={salesSummary?.generated_at ?? undefined}
                    granularityLabel={granularityLabel}
                />
            </div>
        </section>
    );
};

export default AnalyticsPage;

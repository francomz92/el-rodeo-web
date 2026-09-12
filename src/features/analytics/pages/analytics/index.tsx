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
        <section aria-label="Analíticas" className="flex flex-col gap-6 sm:gap-8">
            <AnalyticsFilter queryParams={queryParams} setQueryParams={setQueryParams} />

            <KpiCards total={salesSummary?.data.total} />

            <div className="flex w-full justify-center">
                <div
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1"
                    role="group"
                    aria-label="Tipo de gráfico de ventas"
                >
                    <Button
                        type="button"
                        variant={chartType === "line" ? "default" : "ghost"}
                        size="sm"
                        aria-pressed={chartType === "line"}
                        onClick={() => setChartType("line")}
                        className="hover:cursor-pointer"
                    >
                        Líneas
                    </Button>
                    <Button
                        type="button"
                        variant={chartType === "bar" ? "default" : "ghost"}
                        size="sm"
                        aria-pressed={chartType === "bar"}
                        onClick={() => setChartType("bar")}
                        disabled={!Boolean(points.length)}
                        className="hover:cursor-pointer"
                    >
                        Barras
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <InventoryDoughnut
                        data={inventorySummary?.data}
                        isPending={inventoryIsPending}
                        isError={inventoryIsError}
                        generatedAt={inventorySummary?.generated_at ?? undefined}
                    />
                </div>
                <div className="lg:col-span-3">
                    <SalesTrend
                        points={points}
                        chartType={chartType}
                        isPending={salesIsPending}
                        isError={salesIsError}
                        generatedAt={salesSummary?.generated_at ?? undefined}
                        granularityLabel={granularityLabel}
                    />
                </div>
            </div>
        </section>
    );
};

export default AnalyticsPage;

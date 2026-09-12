import { Bar, Line } from "react-chartjs-2";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { WaveSpinner } from "@components/index";
import { resolveChartColor } from "@analytics/utils/charts";
import salesSummaryQueryKeys from "@analytics/hooks/sales/queryKeys";
import { formatCurrencyARS, formatGeneratedAt } from "@analytics/utils/format";


export type SalesChartType = "line" | "bar";

export type SalesTrendPoint = {
    label: string;
    revenue: number;
    sales_count: number;
};

type SalesTrendProps = {
    points: SalesTrendPoint[];
    chartType: SalesChartType;
    isPending: boolean;
    isError: boolean;
    generatedAt?: string | null;
    granularityLabel: string;
};

const SalesTrend: React.FC<SalesTrendProps> = ({
    points,
    chartType,
    isPending,
    isError,
    generatedAt,
    granularityLabel,
}) => {
    const stalenessLabel = formatGeneratedAt(generatedAt);
    const queryClient = useQueryClient();
    const retry = () => {
        void queryClient.invalidateQueries({ queryKey: salesSummaryQueryKeys.all });
    };

    if (isError) {
        return (
            <Card className="h-full overflow-hidden rounded-xl border border-border py-0">
                <div aria-hidden="true" className="h-0.5 w-full bg-destructive" />
                <CardHeader className="space-y-1 pb-2 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ventas</p>
                    <CardTitle className="font-display text-xl font-semibold tracking-wide">Tendencia de ventas</CardTitle>
                    <CardDescription>{stalenessLabel}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-5">
                    <p className="rounded-xl border border-border bg-muted/60 px-4 py-12 text-center text-destructive">
                        No se pudieron cargar los datos de ventas.
                    </p>
                    <div className="flex justify-center">
                        <Button type="button" variant="outline" size="sm" onClick={retry}>
                            Reintentar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (points.length === 0 && !isPending) {
        return (
            <Card className="h-full overflow-hidden rounded-xl border border-border py-0">
                <div aria-hidden="true" className="h-0.5 w-full bg-chart-2" />
                <CardHeader className="space-y-1 pb-2 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ventas</p>
                    <CardTitle className="font-display text-xl font-semibold tracking-wide">Tendencia de ventas</CardTitle>
                    <CardDescription>{stalenessLabel}</CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                    <p className="rounded-xl border border-border bg-muted/60 px-4 py-12 text-center text-muted-foreground">
                        0 períodos — No se encontraron ventas en el período seleccionado.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const labels = points.map((point) => point.label);
    const revenues = points.map((point) => point.revenue);
    const color = resolveChartColor(1);

    const ariaSummary = `Tendencia de ventas ${granularityLabel}: ${points.length} períodos, `
        + `ingresos de ${labels.length > 0 ? labels[0] : "—"} a ${labels.length > 0 ? labels[labels.length - 1] : "—"}.`;

    const chartData = {
        labels,
        datasets: [
            {
                label: "Ingresos",
                data: revenues,
                backgroundColor: chartType === "line" ? `color-mix(in srgb, ${color} 12%, transparent)` : color,
                borderColor: color,
                fill: chartType === "line",
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" as const },
            tooltip: {
                callbacks: {
                    label: (item: { dataIndex: number }): string =>
                        ` Ingresos: ${formatCurrencyARS(revenues[item.dataIndex] ?? 0)}`,
                },
            },
        },
    };

    return (
        <Card className="h-full overflow-hidden rounded-xl border border-border py-0">
            <div aria-hidden="true" className="h-0.5 w-full bg-chart-2" />
            <CardHeader className="space-y-1 pb-2 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ventas</p>
                <CardTitle className="font-display text-xl font-semibold tracking-wide">Tendencia de ventas</CardTitle>
                <CardDescription>
                    {granularityLabel} · {stalenessLabel}
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-5">
                <div className="relative h-72">
                    {isPending && <WaveSpinner />}
                    <div role="img" aria-label={ariaSummary} className="w-full h-full">
                        {chartType === "line" ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <Bar data={chartData} options={chartOptions} />
                        )}
                    </div>
                    <table className="sr-only">
                        <caption>Tendencia de ventas por período</caption>
                        <thead>
                            <tr>
                                <th scope="col">Período</th>
                                <th scope="col">Ingresos</th>
                                <th scope="col">Ventas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {points.map((point) => (
                                <tr key={point.label}>
                                    <td>{point.label}</td>
                                    <td>{formatCurrencyARS(point.revenue)}</td>
                                    <td>{point.sales_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default SalesTrend;

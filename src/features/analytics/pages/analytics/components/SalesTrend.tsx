import { Bar, Line } from "react-chartjs-2";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { WaveSpinner } from "@components/index";
import { resolveChartColor } from "@analytics/utils/charts";


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
    const stalenessLabel = generatedAt
        ? `Actualizado: ${generatedAt}`
        : "Fecha de actualización no disponible";

    if (isError) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tendencia de ventas</CardTitle>
                    <CardDescription>{stalenessLabel}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="px-4 py-10 text-center text-muted-foreground">
                        No se pudieron cargar los datos de ventas. Intente nuevamente.
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (points.length === 0 && !isPending) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tendencia de ventas</CardTitle>
                    <CardDescription>{stalenessLabel}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="px-4 py-10 text-center text-muted-foreground">
                        No se encontraron ventas en el período seleccionado.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const labels = points.map((point) => point.label);
    const revenues = points.map((point) => point.revenue);
    const color = resolveChartColor(0);

    const ariaSummary = `Tendencia de ventas ${granularityLabel}: ${points.length} períodos, `
        + `ingresos de ${labels.length > 0 ? labels[0] : "—"} a ${labels.length > 0 ? labels[labels.length - 1] : "—"}.`;

    const chartData = {
        labels,
        datasets: [
            {
                label: "Ingresos",
                data: revenues,
                backgroundColor: color,
                borderColor: color,
                fill: chartType === "line",
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" as const },
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tendencia de ventas</CardTitle>
                <CardDescription>
                    {granularityLabel} · {stalenessLabel}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {isPending && <WaveSpinner />}
                    <div role="img" aria-label={ariaSummary}>
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
                                    <td>{point.revenue}</td>
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

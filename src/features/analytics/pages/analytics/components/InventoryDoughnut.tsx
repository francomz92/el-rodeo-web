import { Doughnut } from "react-chartjs-2";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { WaveSpinner } from "@components/index";
import { resolveChartColor } from "@analytics/utils/charts";
import inventorySummaryQueryKeys from "@analytics/hooks/inventory/queryKeys";
import { formatGeneratedAt } from "@analytics/utils/format";
import type { InventorySummaryData } from "@analytics/schemas/output/analytics";


type InventoryDoughnutProps = {
    data?: InventorySummaryData | null;
    isPending: boolean;
    isError: boolean;
    generatedAt?: string | null;
};

const InventoryDoughnut: React.FC<InventoryDoughnutProps> = ({
    data,
    isPending,
    isError,
    generatedAt,
}) => {
    const stalenessLabel = formatGeneratedAt(generatedAt);
    const queryClient = useQueryClient();
    const retry = () => {
        void queryClient.invalidateQueries({ queryKey: inventorySummaryQueryKeys.all });
    };

    if (isError) {
        return (
            <Card className="h-full overflow-hidden rounded-xl border border-border py-0">
                <div aria-hidden="true" className="h-0.5 w-full bg-destructive" />
                <CardHeader className="space-y-1 pb-2 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inventario</p>
                    <CardTitle className="font-display text-xl font-semibold tracking-wide">Inventario por estado</CardTitle>
                    <CardDescription>{stalenessLabel}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-5">
                    <p className="rounded-xl border border-border bg-muted/60 px-4 py-12 text-center text-destructive">
                        No se pudieron cargar los datos de inventario.
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

    const entries = Object.entries(data?.by_status ?? {});
    const isEmpty = !data || data.total === 0 || entries.length === 0;

    if (isEmpty && !isPending) {
        return (
            <Card className="h-full overflow-hidden rounded-xl border border-border py-0">
                <div aria-hidden="true" className="h-0.5 w-full bg-chart-2" />
                <CardHeader className="space-y-1 pb-2 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inventario</p>
                    <CardTitle className="font-display text-xl font-semibold tracking-wide">Inventario por estado</CardTitle>
                    <CardDescription>{stalenessLabel}</CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                    <p className="rounded-xl border border-border bg-muted/60 px-4 py-12 text-center text-muted-foreground">
                        0 animales — No se encontraron datos de inventario.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const labels = entries.map(([status]) => status);
    const values = entries.map(([, count]) => count);
    // Ocre primero: el doughnut abre en chart-2 en lugar de verde.
    const colors = entries.map((_, index) => resolveChartColor(index + 1));
    const total = data?.total ?? 0;

    const ariaSummary = labels.length > 0
        ? `Distribución de inventario: ${labels.map((label, index) => `${label} ${values[index]}`).join(", ")}. Total ${total}.`
        : `Inventario total ${total}.`;

    return (
        <Card className="h-full overflow-hidden rounded-xl border border-border py-0">
            <div aria-hidden="true" className="h-0.5 w-full bg-chart-2" />
            <CardHeader className="space-y-1 pb-2 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inventario</p>
                <CardTitle className="font-display text-xl font-semibold tracking-wide">Inventario por estado</CardTitle>
                <CardDescription>{stalenessLabel}</CardDescription>
            </CardHeader>
            <CardContent className="pb-5">
                <div className="relative h-72">
                    {isPending && <WaveSpinner />}
                    <div role="img" aria-label={ariaSummary} className="w-full h-full">
                        <Doughnut
                            data={{
                                labels,
                                datasets: [
                                    {
                                        data: values,
                                        backgroundColor: colors,
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                            }}
                        />
                    </div>
                    <table className="sr-only">
                        <caption>Inventario por estado</caption>
                        <thead>
                            <tr>
                                <th scope="col">Estado</th>
                                <th scope="col">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(([status, count]) => (
                                <tr key={status}>
                                    <td>{status}</td>
                                    <td>{count}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>Total</td>
                                <td>{total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default InventoryDoughnut;

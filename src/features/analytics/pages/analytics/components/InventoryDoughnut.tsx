import { Doughnut } from "react-chartjs-2";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { WaveSpinner } from "@components/index";
import { resolveChartColors } from "@analytics/utils/charts";
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
    const stalenessLabel = generatedAt
        ? `Actualizado: ${generatedAt}`
        : "Fecha de actualización no disponible";

    if (isError) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Inventario por estado</CardTitle>
                    <CardDescription>{stalenessLabel}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="px-4 py-10 text-center text-muted-foreground">
                        No se pudieron cargar los datos de inventario. Intente nuevamente.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const entries = Object.entries(data?.by_status ?? {});
    const isEmpty = !data || data.total === 0 || entries.length === 0;

    if (isEmpty && !isPending) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Inventario por estado</CardTitle>
                    <CardDescription>{stalenessLabel}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="px-4 py-10 text-center text-muted-foreground">
                        No se encontraron datos de inventario.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const labels = entries.map(([status]) => status);
    const values = entries.map(([, count]) => count);
    const colors = resolveChartColors(entries.length);
    const total = data?.total ?? 0;

    const ariaSummary = labels.length > 0
        ? `Distribución de inventario: ${labels.map((label, index) => `${label} ${values[index]}`).join(", ")}. Total ${total}.`
        : `Inventario total ${total}.`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Inventario por estado</CardTitle>
                <CardDescription>{stalenessLabel}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {isPending && <WaveSpinner />}
                    <div role="img" aria-label={ariaSummary}>
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

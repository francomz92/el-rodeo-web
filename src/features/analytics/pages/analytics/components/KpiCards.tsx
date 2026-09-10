import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import type { SalesTotal } from "@analytics/schemas/output/analytics";


type KpiCardsProps = {
    total?: SalesTotal | null;
};

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("es", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);

const formatNumber = (value: number): string =>
    new Intl.NumberFormat("es", { maximumFractionDigits: 2 }).format(value);

const KpiCards: React.FC<KpiCardsProps> = ({ total }) => {
    const cards = [
        {
            label: "Ingresos totales",
            value: total ? formatCurrency(total.revenue) : "—",
        },
        {
            label: "Ventas",
            value: total ? formatNumber(total.sales_count) : "—",
        },
        {
            label: "Precio promedio por kg",
            value: total ? formatCurrency(total.avg_price_per_kg) : "—",
        },
        {
            label: "Peso total (kg)",
            value: total ? formatNumber(total.total_weight) : "—",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.label}>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{card.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default KpiCards;

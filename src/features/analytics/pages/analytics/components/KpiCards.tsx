import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import type { SalesTotal } from "@analytics/schemas/output/analytics";
import { formatCurrencyARS } from "@analytics/utils/format";


type KpiCardsProps = {
    total?: SalesTotal | null;
};

const formatCurrency = (value: number): string => formatCurrencyARS(value);

const formatNumber = (value: number): string =>
    new Intl.NumberFormat("es", { maximumFractionDigits: 2 }).format(value);

const KPI_ACCENTS = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"];

const KpiCards: React.FC<KpiCardsProps> = ({ total }) => {
    const cards = [
        {
            kicker: "Ingresos",
            label: "Ingresos totales",
            value: total ? formatCurrency(total.revenue) : "—",
        },
        {
            kicker: "Operaciones",
            label: "Ventas",
            value: total ? formatNumber(total.sales_count) : "—",
        },
        {
            kicker: "Precio",
            label: "Precio promedio por kg",
            value: total ? formatCurrency(total.avg_price_per_kg) : "—",
        },
        {
            kicker: "Peso",
            label: "Peso total (kg)",
            value: total ? formatNumber(total.total_weight) : "—",
        },
    ];

    return (
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <Card key={card.label} className="overflow-hidden rounded-xl border border-border py-0">
                    <div aria-hidden="true" className={`h-0.5 w-full ${KPI_ACCENTS[index % KPI_ACCENTS.length]}`} />
                    <CardHeader className="pb-1 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {card.kicker}
                        </p>
                        <CardTitle className="font-display text-xl font-semibold tracking-wide">
                            {card.label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <p className="font-display text-[30px] font-semibold leading-none tracking-wide tabular-nums">{card.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default KpiCards;

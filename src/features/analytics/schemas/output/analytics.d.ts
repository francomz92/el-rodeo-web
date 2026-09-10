export type InventoryByStatus = Record<string, number>;

export type InventoryByTypeEntry = {
    type: string;
    by_status: InventoryByStatus;
};

export type InventorySummaryData = {
    total: number;
    by_status: InventoryByStatus;
    by_type: InventoryByTypeEntry[];
};

export type WeeklyPeriodSummary = {
    week_start: string;
    revenue: number;
    sales_count: number;
    avg_price_per_kg: number;
    total_weight: number;
};

export type MonthlyPeriodSummary = {
    month_start: string;
    revenue: number;
    sales_count: number;
    avg_price_per_kg: number;
    total_weight: number;
};

export type SalesTotal = {
    revenue: number;
    sales_count: number;
    avg_price_per_kg: number;
    total_weight: number;
};

export type SalesSummaryData = {
    weekly: WeeklyPeriodSummary[];
    monthly: MonthlyPeriodSummary[];
    total: SalesTotal;
};

export type ReportWrapper<TData> = {
    data: TData;
    generated_at: string;
    period: unknown;
};

export type InventorySummaryResponse = ReportWrapper<InventorySummaryData>;

export type SalesSummaryResponse = ReportWrapper<SalesSummaryData>;

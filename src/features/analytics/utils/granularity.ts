import type { SalesSummaryData } from "../schemas/output/analytics";


export type SalesGranularity = "weekly" | "monthly";

export const WEEKLY_CUTOFF_DAYS = 31;

const DAY_MS = 86_400_000;

const toUtcMidnight = (value: string): number | null => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }
    const [year, month, day] = value.split("-").map(Number);
    const time = Date.UTC(year, month - 1, day);
    return Number.isNaN(time) ? null : time;
};

export const getDayCount = (from_date: string | null | undefined, to_date: string | null | undefined): number | null => {
    if (!from_date || !to_date) {
        return null;
    }
    const from = toUtcMidnight(from_date);
    const to = toUtcMidnight(to_date);
    if (from === null || to === null || to < from) {
        return null;
    }
    return Math.round((to - from) / DAY_MS);
};

export const resolveGranularity = (
    from_date: string | null | undefined,
    to_date: string | null | undefined,
): SalesGranularity => {
    const days = getDayCount(from_date, to_date);
    if (days === null) {
        return "monthly";
    }
    return days <= WEEKLY_CUTOFF_DAYS ? "weekly" : "monthly";
};

export const selectSalesSeries = (data: SalesSummaryData | undefined, granularity: SalesGranularity) => {
    if (!data) {
        return [];
    }
    return granularity === "weekly" ? data.weekly : data.monthly;
};

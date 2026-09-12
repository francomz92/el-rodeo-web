import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";


ChartJS.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler,
);

export const CHART_CSS_VARS = [
    "--chart-1",
    "--chart-2",
    "--chart-3",
    "--chart-4",
    "--chart-5",
] as const;

const CHART_COLOR_FALLBACKS = ["#2e7d4f", "#b7791f", "#4a6fa5", "#c05a2e", "#3e6b5e"];

const readCssVar = (name: string): string | null => {
    if (typeof window === "undefined" || typeof getComputedStyle === "undefined") {
        return null;
    }
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value === "" ? null : value;
};

export const resolveChartColor = (index: number): string => {
    const varName = CHART_CSS_VARS[index % CHART_CSS_VARS.length];
    return readCssVar(varName) ?? CHART_COLOR_FALLBACKS[index % CHART_COLOR_FALLBACKS.length];
};

export const resolveChartColors = (count: number): string[] =>
    Array.from({ length: Math.max(count, 0) }, (_, index) => resolveChartColor(index));

export { ChartJS };

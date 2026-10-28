import { useState, useCallback, useMemo, useEffect, createContext, type PropsWithChildren } from "react";

import type { ThemeContextValue } from "../schemas/themeSchema";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = "el-rodeo-theme";

/** Read the persisted theme; a missing or unreadable key falls back to light. */
const readStoredTheme = (): boolean => {
    if (typeof window === "undefined") return false;

    try {
        return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark";
    } catch {
        return false;
    }
};

export function ThemeProvider({ children }: PropsWithChildren) {
    const [isDark, setIsDark] = useState(readStoredTheme);

    // Applied at boot as well as on toggle, so a reload keeps the chosen theme.
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
        } catch {
            // Storage unavailable (private mode): the in-memory theme still applies.
        }
    }, [isDark]);

    const toggleTheme = useCallback(() => {
        setIsDark(value => !value);
    }, []);

    const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);


    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

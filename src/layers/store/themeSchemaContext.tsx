import { useState, useCallback, useMemo, createContext, type PropsWithChildren } from "react";

import type { ThemeContextValue } from "../schemas/themeSchema";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = useCallback(() => {
        setIsDark(value => !value);
    }, []);

    const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);


    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

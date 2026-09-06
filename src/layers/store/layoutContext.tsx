import { useState, useCallback, useMemo, createContext, type PropsWithChildren } from "react";

import type { LayoutContextValue } from "../schemas/layoutContext";

export const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: PropsWithChildren) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = useCallback((value?: boolean) => {
        if (value !== undefined && typeof value === "boolean") {
            setIsCollapsed(value);
        } else {
            setIsCollapsed(value => !value);
        }
    }, []);

    const value = useMemo(() => ({ isCollapsed, isMobileOpen, toggleSidebar, setMobileOpen }), [isCollapsed, isMobileOpen, toggleSidebar]);


    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

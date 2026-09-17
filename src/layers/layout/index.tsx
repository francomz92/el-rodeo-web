import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { cn } from "@utils/cssStyle.lib";

import { Sidebar, Header } from "./components";
import { useLayout } from "../hooks/layout.hook";
import { useMediaQuery } from "../hooks/mediaQuery.hook";
import FieldLeavesBackground from "@components/FieldLeavesBackground";

const Layout = () => {
    const { isCollapsed, toggleSidebar, setMobileOpen } = useLayout();

    let isDesktop = useMediaQuery("(min-width: 48rem)");

    useEffect(() => {
        toggleSidebar(isDesktop);
        if (!isDesktop) {
            setMobileOpen(false);
        }
    }, [isDesktop]);

    return (
        <div className="min-h-svh bg-background text-foreground antialiased">
            <FieldLeavesBackground>
                <Sidebar />
                <div
                    className={cn(
                        "flex min-h-svh flex-col transition-[padding-left] duration-300",
                        isCollapsed ? "md:pl-18" : "md:pl-72", // debe coincidir con el w-72 del sidebar
                    )}
                >
                    <Header />
                    <main className="relative flex-1 overflow-x-hidden p-4 md:p-6">
                        <Outlet />
                    </main>
                </div>
            </FieldLeavesBackground>
        </div>
    );
};

export default Layout;

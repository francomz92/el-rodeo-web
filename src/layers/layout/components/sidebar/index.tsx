import { cn } from "@utils/cssStyle.lib";
import { ScrollArea } from "@components/ui/scroll-area";

import { SidebarLogo, SidebarNav, SidebarPromo } from "./components";
import { useLayout } from "../../../hooks/layout.hook";
import { useActivePath } from "../../../hooks/activePath.hook";
import { useProfile } from "../../../../features/auth/hooks/profile";
import { PUBLIC_AUTH_ROLES } from "../../../../features/auth/constants";

const Sidebar = () => {
    const { isCollapsed, isMobileOpen, setMobileOpen } = useLayout();
    const currentPath = useActivePath();
    const { user, userTenant } = useProfile();

    return (
        <>
            {/* Backdrop móvil */}
            <div
                aria-hidden="true"
                onClick={() => setMobileOpen(false)}
                className={cn(
                    "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden",
                    isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
                )}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 w-72 left-0 z-50 flex flex-col rounded-none border-r border-sidebar-border bg-sidebar transition-transform duration-300",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full",
                    "md:translate-x-0",
                    isCollapsed && "md:w-18 text-end",
                )}
            >
                <SidebarLogo userTenant={userTenant!} isCollapsed={isCollapsed} />
                <ScrollArea className="flex-1 px-4 py-5">
                    <SidebarNav currentPath={currentPath} isCollapsed={isCollapsed} />
                </ScrollArea>
                {user?.role === PUBLIC_AUTH_ROLES.OWNER && userTenant?.plan?.plan_type === "free" && (
                    <div className="p-4">
                        <SidebarPromo />
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;

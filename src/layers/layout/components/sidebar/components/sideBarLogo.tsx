import { Link } from "react-router-dom";
import type { UserMeTenantResponseSchema } from "../../../../../features/auth/schemas/output/user";

interface SidebarLogoProps {
    userTenant: UserMeTenantResponseSchema
    isCollapsed: boolean
}

const SidebarLogo = ({ userTenant, isCollapsed }: SidebarLogoProps) => {

    return (
        <Link to="/" className={"h-16 shrink-0 flex items-center gap-2.5 " + (isCollapsed ? "justify-center px-0" : "px-6")}>
            <span className="grid size-9 place-items-center rounded-full bg-sidebar-primary font-display text-lg font-semibold text-sidebar-primary-foreground">
                { userTenant?.name?.[0].toLowerCase() }
            </span>
            { !isCollapsed && <span className="font-display text-2xl font-semibold tracking-wide text-sidebar-foreground">{ userTenant?.name }</span> }
        </Link>
    );
};

export default SidebarLogo;

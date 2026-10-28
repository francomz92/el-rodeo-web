import {
    BarChart3,
    Calendar,
    Vegan,
    PawPrint,
    Users,
    Library,
    ShoppingCart,
} from "lucide-react";

import { AUTH_ROLES } from "../../features/auth/constants";

import type { NavigationSection } from "../schemas/navigation";

const ADMIN_PLUS_ROLES = [AUTH_ROLES.ADMIN, AUTH_ROLES.OWNER, AUTH_ROLES.SUPERADMIN];

export const defaultActivePath = "/analytics";

export const navigationSections: NavigationSection[] = [
    {
        label: "Dashboard",
        items: [
            { title: "Analíticas", href: "/analytics", icon: BarChart3, roles: ADMIN_PLUS_ROLES },
            { title: "Usuarios", href: "/users", icon: Users, roles: ADMIN_PLUS_ROLES },
            { title: "Ganado", href: "/cattle", icon: PawPrint },
            { title: "Insumos", href: "/supplies", icon: Vegan },
            { title: "Compras", href: "/purchases", icon: ShoppingCart },
        ],
    },
    {
        label: "Apps",
        items: [
            { title: "Calendario", href: "/calendar", icon: Calendar },
            { title: "Informe", href: "/reports", icon: Library, roles: ADMIN_PLUS_ROLES },
        ],
    },
];

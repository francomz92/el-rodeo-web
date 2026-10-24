import {
    BarChart3,
    Calendar,
    Contact,
    Mail,
    MessageSquare,
    Sparkles,
    StickyNote,
    Vegan,
    PawPrint,
    Users,
    SquareUser,
    Library,
    Store,
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
            { title: "Clientes", href: "/buyers", icon: SquareUser },
        ],
    },
    {
        label: "Apps",
        items: [
            {
                title: "IA",
                href: "/ai",
                icon: Sparkles,
                children: [
                    { title: "Chat", href: "/ai/chat", badge: "New" },
                    { title: "Imagen", href: "/ai/image", badge: "New" },
                ],
            },
            { title: "Venta", href: "/sales", icon: Store },
            { title: "Calendario", href: "/calendar", icon: Calendar },
            { title: "Chats", href: "/chats", icon: MessageSquare },
            { title: "Email", href: "/email", icon: Mail },
            { title: "Notas", href: "/notes", icon: StickyNote },
            { title: "Informe", href: "/reports", icon: Library, roles: ADMIN_PLUS_ROLES },
            { title: "Contacto", href: "/contacts", icon: Contact },
        ],
    },
];

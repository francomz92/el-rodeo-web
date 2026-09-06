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
} from "lucide-react";

import type { NavigationSection } from "../schemas/navigation";

export const defaultActivePath = "/analytics";

export const navigationSections: NavigationSection[] = [
    {
        label: "Dashboard",
        items: [
            { title: "Analíticas", href: "/analytics", icon: BarChart3 },
            { title: "Usuarios", href: "/users", icon: Users },
            { title: "Ganado", href: "/cattle", icon: PawPrint },
            { title: "Insumos", href: "/supplies", icon: Vegan },
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
            { title: "Informe", href: "/reports", icon: Library },
            { title: "Contacto", href: "/contacts", icon: Contact },
        ],
    },
];

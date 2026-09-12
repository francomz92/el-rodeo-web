import { ChevronDown } from "lucide-react";

import { cn } from "@utils/cssStyle.lib";
import type { NavigationItem } from "../../../../schemas/navigation";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../../../../hooks/mediaQuery.hook";
import { useLayout } from "../../../../hooks/layout.hook";

interface SidebarItemProps {
    item: NavigationItem;
    isActive: (href: string) => boolean;
}

const SidebarItem = ({ item, isActive }: SidebarItemProps) => {
    const hasChildren = Boolean(item.children?.length);
    const { setMobileOpen } = useLayout();
    const [open, setOpen] = useState(() => hasChildren && item.children!.some((c) => isActive(c.href)));
    const Icon = item.icon;
    const active = isActive(item.href);
    let isDesktop = useMediaQuery("(min-width: 48rem)");

    const onClick = () => {
        if (!isDesktop) {
            setMobileOpen(false)
        }
    };

    if (!hasChildren) {
        return (
            <Link
                onClick={onClick}
                to={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    active && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                )}
                title={item.title}
                aria-label={item.title}
            >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{item.title}</span>
            </Link>
        );
    }

    return (
        <div>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                title={item.title}
                aria-label={item.title}
            >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1 truncate text-left">{item.title}</span>
                <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <ul className="ml-6 mt-1 space-y-0.5 border-l border-sidebar-border pl-4">
                    {item.children!.map((child) => (
                        <li onClick={onClick} key={child.href}>
                            <Link
                                to={child.href}
                                className={cn(
                                    "flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isActive(child.href) && "bg-sidebar-primary font-medium text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                                )}
                                title={child.title}
                                aria-label={child.title}
                            >
                                {child.title}
                                {child.badge && (
                                    <span className="rounded-md bg-sidebar-primary px-2 py-0.5 text-[10px] font-semibold text-sidebar-primary-foreground">
                                        {child.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SidebarItem;

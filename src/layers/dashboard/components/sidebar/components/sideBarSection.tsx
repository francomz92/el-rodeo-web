import { cn } from "@utils/cssStyle.lib";

import SidebarItem from "./sideBarItem";
import type { NavigationSection } from "../../../../schemas/navigation";

interface SidebarSectionProps {
    section: NavigationSection;
    isActive: (href: string) => boolean;
    isCollapsed: boolean;
}

const SidebarSection = ({ section, isActive, isCollapsed }: SidebarSectionProps) => {
    return (
        <div className="space-y-1.5">
            <p
                className={cn(
                    "px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                    isCollapsed ? "text-xl" : undefined,
                )}
                title={section.label}
                aria-label={section.label}
            >
                {isCollapsed ? section.label.charAt(0).toUpperCase() : section.label}
            </p>
            <ul className="space-y-1">
                {section.items.map((item) => (
                    <li key={item.title}>
                        <SidebarItem item={item} isActive={isActive} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SidebarSection;

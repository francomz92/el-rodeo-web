import SidebarSection from "./sideBarSection";
import { navigationSections } from "../../../../data/navigation.data";
import { useProfile } from "../../../../../features/auth/hooks/profile";
import type { NavigationItem } from "../../../../schemas/navigation";

// Keeps the sidebar consistent with the route gates: links a role cannot use are hidden.
const SidebarNav = ({ currentPath, isCollapsed }: { currentPath: string; isCollapsed: boolean }) => {
  const { user } = useProfile();

  const isActive = (href: string) => currentPath === href;

  const canSee = ({ roles }: NavigationItem) => !roles?.length || (Boolean(user?.role) && roles.includes(user!.role));

  const visibleSections = () =>
    navigationSections
      .map((section) => ({ ...section, items: section.items.filter(canSee) }))
      .filter((section) => section.items.length > 0);

  return (
    <nav aria-label="Navegación principal" className="space-y-7">
      {visibleSections().map((section) => (
        <SidebarSection key={section.label} section={section} isActive={isActive} isCollapsed={isCollapsed} />
      ))}
    </nav>
  );
};

export default SidebarNav;

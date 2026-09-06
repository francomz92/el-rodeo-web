import SidebarSection from "./sideBarSection";
import { navigationSections } from "../../../../data/navigation.data";

const SidebarNav = ({ currentPath, isCollapsed }: { currentPath: string; isCollapsed: boolean }) => {
  const isActive = (href: string) => currentPath === href;

  return (
    <nav aria-label="Navegación principal" className="space-y-7">
      {navigationSections.map((section) => (
        <SidebarSection key={section.label} section={section} isActive={isActive} isCollapsed={isCollapsed} />
      ))}
    </nav>
  );
}

export default SidebarNav;

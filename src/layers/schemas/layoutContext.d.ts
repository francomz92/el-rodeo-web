export interface LayoutContextValue {
  isCollapsed: boolean;      // desktop
  isMobileOpen: boolean;     // drawer móvil
  toggleSidebar: (value?: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

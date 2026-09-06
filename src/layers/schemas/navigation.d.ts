import type { LucideIcon } from "lucide-react";

export interface NavigationChild {
  title: string;
  href: string;
  badge?: string;
}

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: NavigationChild[];
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

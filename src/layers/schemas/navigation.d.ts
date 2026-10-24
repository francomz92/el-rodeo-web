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
  /** Viewing ranks allowed to see this link; empty means everyone signed in. */
  roles?: string[];
  children?: NavigationChild[];
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

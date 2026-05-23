import type { LucideIcon } from "lucide-react";

export interface BaseNavItem {
  title?: string;
  name?: string;
  badge?: string;
  icon?: LucideIcon;
}

export interface NavLink extends BaseNavItem {
  url: string;
  items?: never;
}

export interface NavCollapsible extends BaseNavItem {
  items: (BaseNavItem & { url: string })[];
  url?: never;
}

export type NavItem = NavCollapsible | NavLink;

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavEntryItem extends BaseNavItem {
  component: "item";
  url: string;
  state?: unknown;
  route?: never;
  _children?: never;
}

export interface NavEntryGroup extends BaseNavItem {
  component: "group";
  route: string;
  _children: NavEntryItem[];
  url?: never;
  state?: never;
}

export type NavEntry = NavEntryItem | NavEntryGroup;

export interface SidebarData {
  navGroups?: NavGroup[];
  navLinks?: NavItem[];
  navItems?: NavEntry[];
}

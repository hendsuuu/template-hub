/**
 * The main navigation. Icons are named here and drawn by NavIcon.astro, so this
 * file stays plain TypeScript.
 */
import { BASE, paths } from "./paths";

/** Lucide icon names; NavIcon.astro maps each to its component. */
export type NavIconName = "layout-dashboard" | "bot" | "square-kanban" | "list-checks" | "calendar-clock" | "blocks" | "compass";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIconName;
  /** Only the exact address counts (the overview), not everything under it. */
  exact?: boolean;
}

export const NAV: readonly NavItem[] = [
  { href: paths.overview(), label: "Overview", icon: "layout-dashboard", exact: true },
  { href: paths.agents(), label: "Agents", icon: "bot" },
  { href: paths.board(), label: "Board", icon: "square-kanban" },
  { href: paths.jobs(), label: "Jobs", icon: "list-checks" },
  { href: paths.schedules(), label: "Schedules", icon: "calendar-clock" },
  { href: paths.components(), label: "Components", icon: "blocks" },
];

export const NOT_FOUND: Pick<NavItem, "label" | "icon"> = { label: "Page not found", icon: "compass" };

const trim = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

export function isActive(item: NavItem, pathname: string): boolean {
  const path = trim(pathname);
  const href = trim(item.href);
  return item.exact ? path === href || path === trim(BASE || "/") : path === href || path.startsWith(`${href}/`);
}

/** The nav item a path belongs to, or the not-found page's title and icon. */
export function pageFor(pathname: string): Pick<NavItem, "label" | "icon"> {
  return NAV.find((item) => isActive(item, pathname)) ?? NOT_FOUND;
}

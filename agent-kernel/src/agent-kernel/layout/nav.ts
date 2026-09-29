import { Blocks, Bot, CalendarClock, Compass, LayoutDashboard, ListChecks, SquareKanban, type LucideIcon } from "lucide-react";
import { BASE, paths } from "../paths";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Only the exact address counts (the overview), not everything under it. */
  exact?: boolean;
}

export const NAV: readonly NavItem[] = [
  { href: paths.overview(), label: "Overview", icon: LayoutDashboard, exact: true },
  { href: paths.agents(), label: "Agents", icon: Bot },
  { href: paths.board(), label: "Board", icon: SquareKanban },
  { href: paths.jobs(), label: "Jobs", icon: ListChecks },
  { href: paths.schedules(), label: "Schedules", icon: CalendarClock },
  { href: paths.components(), label: "Components", icon: Blocks },
];

const NOT_FOUND: Pick<NavItem, "label" | "icon"> = { label: "Page not found", icon: Compass };

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

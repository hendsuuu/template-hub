"use client";

import { Bell, Menu, RefreshCw } from "lucide-react";
import type { DashboardUser } from "../types";
import { IconButton } from "../components/Button";
import { ThemeToggle } from "../components/ThemeToggle";
import { cx } from "../lib/cx";
import { formatClock, initials } from "../lib/format";
import { paths } from "../paths";
import { Link, usePathname } from "../router";
import { pageFor } from "./nav";
import { DRAWER_ID } from "./Sidebar";

interface TopBarProps {
  user: DashboardUser;
  /** When the data on screen was fetched. */
  updatedAt: Date;
  /** Jobs waiting for a person: the bell's count. */
  waiting: number;
}

/** Page icon and title on the left; live state, last update, refresh, "Waiting for you", the theme and the user on the right. */
export function TopBar({ user, updatedAt, waiting }: TopBarProps) {
  const pathname = usePathname();
  const { label: title, icon: PageIcon } = pageFor(pathname);
  const waitingLabel = waiting === 0 ? "Waiting for you: nothing" : `Waiting for you: ${waiting} ${waiting === 1 ? "job" : "jobs"}`;

  return (
    <header className="ak-topbar">
      <button type="button" className="ak-topbar__menu" popoverTarget={DRAWER_ID} aria-label="Open menu">
        <Menu size={18} aria-hidden="true" />
      </button>

      <div className="ak-topbar__title-row">
        <PageIcon size={20} className="ak-topbar__page-icon" aria-hidden="true" />
        <h1 tabIndex={-1} className="ak-topbar__title">
          {title}
        </h1>
      </div>

      <div className="ak-topbar__tools">
        <LiveIndicator />
        <p className="ak-topbar__updated">
          <span className="ak-topbar__updated-word">Updated </span>
          <time dateTime={updatedAt.toISOString()}>{formatClock(updatedAt)}</time>
        </p>
        {/* Wire this to your data refetch. */}
        <IconButton label="Refresh now" icon={RefreshCw} />
        <Link href={paths.boardWaiting()} className={cx("ak-icon-btn", waiting > 0 && "ak-topbar__waiting")} aria-label={waitingLabel} title={waitingLabel}>
          <Bell size={16} aria-hidden="true" />
          {waiting > 0 && (
            <span className="ak-topbar__badge" aria-hidden="true">
              {waiting > 99 ? "99+" : waiting}
            </span>
          )}
        </Link>
        <ThemeToggle />
        <span className="ak-avatar" role="img" aria-label={`Signed in as ${user.name}`} title={`${user.name} · ${user.email}`}>
          {initials(user.name)}
        </span>
      </div>
    </header>
  );
}

/** "Live" with a green dot; connect it to your stream or poller. */
export function LiveIndicator() {
  return (
    <p className="ak-live" title="Live updates are on." role="status">
      <span className="ak-live__dot" aria-hidden="true" />
      <span className="ak-live__label" aria-hidden="true">
        Live
      </span>
      <span className="sr-only">Live updates are on.</span>
    </p>
  );
}

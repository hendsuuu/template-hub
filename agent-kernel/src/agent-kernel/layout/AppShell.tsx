"use client";

import { useRef, type ReactNode } from "react";
import type { AgentSummary, DashboardUser } from "../types";
import { DRAWER_ID, Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  user: DashboardUser;
  tenantName: string;
  agents: readonly AgentSummary[];
  updatedAt: Date;
  waiting: number;
  children: ReactNode;
}

/**
 * Sidebar (collapsible to icons above 900px, a popover drawer below), the top
 * bar and the page. The drawer needs no script to open: the menu button is its
 * popover target.
 */
export function AppShell({ user, tenantName, agents, updatedAt, waiting, children }: AppShellProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const closeDrawer = () => drawerRef.current?.hidePopover?.();

  return (
    <div className="ak-shell">
      <a
        href="#main"
        className="ak-skip"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>

      <aside className="ak-shell__sidebar" aria-label="Sidebar">
        <Sidebar mode="rail" agents={agents} user={user} tenantName={tenantName} />
      </aside>

      <div id={DRAWER_ID} ref={drawerRef} popover="auto" className="ak-nav-drawer" aria-label="Menu">
        <Sidebar mode="drawer" agents={agents} user={user} tenantName={tenantName} onNavigate={closeDrawer} />
      </div>

      <div className="ak-shell__column">
        <TopBar user={user} updatedAt={updatedAt} waiting={waiting} />
        <main id="main" ref={mainRef} tabIndex={-1} className="ak-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}

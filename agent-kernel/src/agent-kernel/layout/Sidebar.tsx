"use client";

import { Suspense, useSyncExternalStore } from "react";
import { ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen, Users, Waypoints, X } from "lucide-react";
import type { AgentSummary, DashboardUser } from "../types";
import { AgentAvatar } from "../components/AgentAvatar";
import { StatusDot } from "../components/StatusBadge";
import { initials } from "../lib/format";
import { AGENT_STATUS } from "../lib/status";
import { paths } from "../paths";
import { Link, usePathname, useSearchParam } from "../router";
import { NAV, isActive } from "./nav";
import { isSidebarCollapsed, setSidebarCollapsed, subscribeSidebar } from "./sidebarState";

export const DRAWER_ID = "ak-nav-drawer";

interface SidebarProps {
  /** rail: the desktop sidebar, collapsible to icons · drawer: the phone menu. */
  mode: "rail" | "drawer";
  agents: readonly AgentSummary[];
  user: DashboardUser;
  tenantName: string;
  /** Following a link in the drawer closes it. */
  onNavigate?: () => void;
}

export function Sidebar({ mode, agents, user, tenantName, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="ak-sidebar">
      <div className="ak-sidebar__brand">
        <Link href={paths.overview()} className="ak-sidebar__product" onClick={onNavigate}>
          {/* Placeholder mark: put your approved logo here, at the same size. */}
          <span className="ak-sidebar__mark" aria-hidden="true">
            <Waypoints size={16} />
          </span>
          Agent hub
        </Link>
        {mode === "drawer" ? (
          <button type="button" className="ak-sidebar__toggle" popoverTarget={DRAWER_ID} popoverTargetAction="hide" aria-label="Close menu" title="Close menu">
            <X size={18} aria-hidden="true" />
          </button>
        ) : (
          <CollapseToggle />
        )}
      </div>

      <div className="ak-sidebar__scroll">
        <nav aria-label="Main" className="ak-sidebar__nav">
          <ul>
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onNavigate} className="ak-navlink" aria-current={isActive(item, pathname) ? "page" : undefined}>
                    <Icon size={17} aria-hidden="true" />
                    <span className="ak-navlink__label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <details className="ak-sidebar__agents" open>
          <summary className="ak-sidebar__section-toggle">
            <Users size={17} aria-hidden="true" />
            <span className="ak-navlink__label">Agents</span>
            <ChevronDown size={15} className="ak-sidebar__chevron" aria-hidden="true" />
          </summary>
          <Suspense fallback={<AgentLinks agents={agents} current={null} onNavigate={onNavigate} />}>
            <CurrentAgentLinks agents={agents} onNavigate={onNavigate} />
          </Suspense>
        </details>
      </div>

      <div className="ak-sidebar__account">
        <div className="ak-sidebar__user">
          <span className="ak-avatar" aria-hidden="true">
            {initials(user.name)}
          </span>
          <div className="ak-sidebar__user-text">
            <p className="ak-sidebar__user-name">{user.name}</p>
            <p className="ak-sidebar__user-email">{user.email}</p>
          </div>
          <span className={user.role === "admin" ? "ak-sidebar__role ak-sidebar__role--admin" : "ak-sidebar__role"}>{user.role === "admin" ? "Admin" : "Viewer"}</span>
        </div>
        <Link href={paths.login()} className="ak-sidebar__signout" onClick={onNavigate}>
          <LogOut size={17} aria-hidden="true" />
          <span className="ak-navlink__label">Sign out</span>
        </Link>
        <p className="ak-sidebar__footer">{tenantName}</p>
      </div>
    </div>
  );
}

/** Collapse to icons and back; the choice is kept in the browser. */
function CollapseToggle() {
  const collapsed = useSyncExternalStore(subscribeSidebar, isSidebarCollapsed, () => false);

  const label = collapsed ? "Expand the sidebar" : "Collapse the sidebar";
  return (
    <button
      type="button"
      className="ak-sidebar__toggle"
      aria-label={label}
      title={label}
      aria-pressed={collapsed}
      onClick={() => setSidebarCollapsed(!isSidebarCollapsed())}
    >
      <PanelLeftClose size={18} aria-hidden="true" className="ak-sidebar__toggle-close" />
      <PanelLeftOpen size={18} aria-hidden="true" className="ak-sidebar__toggle-open" />
    </button>
  );
}

/** The agent whose board is open is marked; it is read from ?agent=, so it waits for the browser. */
function CurrentAgentLinks({ agents, onNavigate }: { agents: readonly AgentSummary[]; onNavigate: (() => void) | undefined }) {
  const pathname = usePathname();
  const agent = useSearchParam("agent");
  const onBoard = pathname === paths.board() || pathname.startsWith(`${paths.board()}/`);
  return <AgentLinks agents={agents} current={onBoard ? agent : null} onNavigate={onNavigate} />;
}

function AgentLinks({ agents, current, onNavigate }: { agents: readonly AgentSummary[]; current: string | null; onNavigate: (() => void) | undefined }) {
  const sorted = [...agents].sort((a, b) => a.agentId.localeCompare(b.agentId));
  if (sorted.length === 0) return <p className="ak-muted px-2.5 py-1 text-xs">No agents yet</p>;
  return (
    <ul className="ak-sidebar__agent-list">
      {sorted.map((agent) => {
        const status = AGENT_STATUS[agent.status];
        return (
          <li key={agent.agentId}>
            <Link
              href={paths.board(agent.agentId)}
              onClick={onNavigate}
              className="ak-agentlink"
              aria-current={current === agent.agentId ? "page" : undefined}
              title={`${agent.agentId}: ${status.label}`}
            >
              <span className="ak-agentlink__avatar">
                <AgentAvatar size="sm" />
                <StatusDot status={agent.status} />
              </span>
              <span className="ak-navlink__label">{agent.agentId}</span>
              <span className="sr-only">, {status.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

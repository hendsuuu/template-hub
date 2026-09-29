"use client";

import { useMemo } from "react";
import type { AgentSummary } from "../types";
import { cx } from "../lib/cx";
import { formatAgo, formatDateTime, formatElapsed } from "../lib/format";
import { timeValue } from "../lib/sort";
import { agentStatusRank } from "../lib/status";
import { paths } from "../paths";
import { Link, useNavigate } from "../router";
import { AgentAvatar } from "./AgentAvatar";
import { DataTable, type Column } from "./DataTable";
import { StatusBadge } from "./StatusBadge";

interface AgentsTableProps {
  agents: readonly AgentSummary[];
  now: Date;
  caption: string;
}

/** Agents as a sortable table; a row opens the board for that agent. */
export function AgentsTable({ agents, now, caption }: AgentsTableProps) {
  const navigate = useNavigate();
  const columns = useMemo<Column<AgentSummary>[]>(
    () => [
      { key: "position", header: "Position", headerVisual: "#", wideOnly: true, className: "ak-table__position", render: (_agent, position) => position },
      {
        key: "agent",
        header: "Agent",
        primary: true,
        sortValue: (a) => a.agentId,
        render: (a) => (
          <div className="ak-who">
            <AgentAvatar />
            <div className="ak-identity">
              <Link href={paths.board(a.agentId)} className="ak-agent-name">
                {a.agentId}
              </Link>
              <span className="ak-role">{a.role}</span>
            </div>
          </div>
        ),
      },
      { key: "status", header: "Status", sortValue: (a) => agentStatusRank(a.status), render: (a) => <StatusBadge status={a.status} /> },
      { key: "work", header: "Current work", className: "ak-work-cell", render: (a) => <CurrentWork agent={a} now={now} /> },
      {
        key: "seen",
        header: "Last seen",
        sortValue: (a) => {
          const t = timeValue(a.lastSeenAt);
          return t === null ? null : -t;
        },
        render: (a) =>
          a.lastSeenAt ? (
            <time dateTime={a.lastSeenAt} title={formatDateTime(a.lastSeenAt)} className="ak-muted ak-nowrap">
              {formatAgo(a.lastSeenAt, now)}
            </time>
          ) : (
            <span className="ak-muted">Never</span>
          ),
      },
      {
        key: "day",
        header: "Last 24 h",
        sortValue: (a) => a.completed24h,
        render: (a) => (
          <span className="ak-nowrap">
            {a.completed24h} done
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, </span>
            <span className={cx(a.failed24h > 0 && "ak-failed-text")}>{a.failed24h} failed</span>
          </span>
        ),
      },
      { key: "queued", header: "Queued", align: "end", sortValue: (a) => a.queuedFor, render: (a) => a.queuedFor },
    ],
    [now],
  );

  return (
    <DataTable
      caption={caption}
      columns={columns}
      rows={agents}
      rowKey={(a) => a.agentId}
      initialSort={{ key: "status", direction: "asc" }}
      onRowClick={(a) => navigate(paths.board(a.agentId))}
      cards="md"
    />
  );
}

/** What the agent is doing now, in a line or two. */
export function CurrentWork({ agent, now }: { agent: AgentSummary; now: Date }) {
  switch (agent.status) {
    case "working": {
      const job = agent.currentJob;
      if (!job) return <span className="ak-muted">Working on a job</span>;
      return (
        <div className="ak-work">
          <Link href={paths.job(job.jobId)} className="ak-job-id">
            {job.jobId}
          </Link>
          <span className="ak-truncate">
            {job.objective}
            {job.since && <span className="ak-muted"> · {formatElapsed(job.since, now)}</span>}
          </span>
        </div>
      );
    }
    case "waiting": {
      const job = agent.waitingJob;
      return (
        <div className="ak-work">
          <span className="ak-needs">Needs a person{agent.waitingCount > 1 ? ` · ${agent.waitingCount} jobs` : ""}</span>
          <span className="ak-truncate">{job ? (job.reason ?? job.objective) : "A job is waiting for a person."}</span>
        </div>
      );
    }
    case "picking_up":
      return <span className="ak-muted">{agent.queuedFor > 1 ? `${agent.queuedFor} jobs queued for it` : "A job is queued for it"}</span>;
    case "idle":
      return <span className="ak-muted">Nothing to do</span>;
    case "not_responding":
    case "offline":
      return <span className="ak-muted">No recent check-in</span>;
    case "never":
      return <span className="ak-muted">Registered {formatAgo(agent.registeredAt, now)}</span>;
    case "paused":
      return <span className="ak-muted">Paused by an operator</span>;
  }
}

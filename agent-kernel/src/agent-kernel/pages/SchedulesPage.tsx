"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CalendarClock, MonitorCog, Play, RefreshCw } from "lucide-react";
import type { AgentCron, HubSchedule } from "../types";
import { Button, IconButton } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { DataTable, type Column } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { Switch } from "../components/Fields";
import { Panel, PageHeader } from "../components/Panel";
import { Pill } from "../components/Pill";
import { JobStatusTag } from "../components/StatusBadge";
import { cx } from "../lib/cx";
import { NOW, getSchedules } from "../lib/data";
import { formatAgo, formatDateTime, formatUntil, formatUsd, formatWhen } from "../lib/format";
import { describeAssignee } from "../lib/jobs";
import { timeValue } from "../lib/sort";
import { cronRunTone } from "../lib/status";
import { paths } from "../paths";
import { Link } from "../router";

/** What runs on its own: the hub's schedules, and cron jobs on agent computers. A last job's drawer arrives as `children`. */
export function SchedulesPage({ children }: { children?: ReactNode }) {
  const { hub, agents } = getSchedules();
  return (
    <>
      <div className="ak-page">
        <PageHeader title="Schedules" subtitle="Work that runs on its own: schedules the hub runs, and cron jobs on agent computers." />
        <HubSchedules schedules={hub} now={NOW} />
        <AgentCrons crons={agents} now={NOW} />
      </div>
      {children}
    </>
  );
}

type Action = "enable" | "disable" | "run";

interface Pending {
  action: Action;
  schedule: HubSchedule;
}

/** "leads-01", or "any research agent" (lower case, for the middle of a sentence). */
function assigneeInSentence(assignee: string): string {
  const words = describeAssignee(assignee);
  return assignee.startsWith("role:") ? words.charAt(0).toLowerCase() + words.slice(1) : words;
}

function confirmCopy({ action, schedule }: Pending): { title: string; text: string; confirmLabel: string; danger: boolean } {
  switch (action) {
    case "enable":
      return {
        title: `Turn on “${schedule.name}”?`,
        text: `The hub posts its job for ${assigneeInSentence(schedule.assignee)} each time it is due (${schedule.describe.toLowerCase()}).`,
        confirmLabel: "Turn on",
        danger: false,
      };
    case "disable":
      return {
        title: `Turn off “${schedule.name}”?`,
        text: "It stops posting jobs until someone turns it on again. Jobs it already posted carry on.",
        confirmLabel: "Turn off",
        danger: true,
      };
    case "run":
      return {
        title: `Run “${schedule.name}” now?`,
        text: `The hub posts its job once, now, for ${assigneeInSentence(schedule.assignee)}. Its regular times stay as they are.`,
        confirmLabel: "Run now",
        danger: false,
      };
  }
}

function HubSchedules({ schedules, now }: { schedules: readonly HubSchedule[]; now: Date }) {
  // The template keeps the switches in memory; connect `confirm` to your API.
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(schedules.map((s) => [s.scheduleId, s.enabled])));
  const [pending, setPending] = useState<Pending | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const rows = schedules.map((s) => ({ ...s, enabled: enabled[s.scheduleId] ?? s.enabled }));

  const confirm = ({ action, schedule }: Pending) => {
    if (action === "run") setNotice(`“${schedule.name}” posted its job.`);
    else {
      setEnabled((current) => ({ ...current, [schedule.scheduleId]: action === "enable" }));
      setNotice(action === "enable" ? `“${schedule.name}” is on.` : `“${schedule.name}” is off.`);
    }
    setPending(null);
  };

  const columns = useMemo<Column<HubSchedule>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        primary: true,
        className: "ak-name-cell",
        sortValue: (s) => s.name,
        render: (s) => (
          <div className="ak-stack">
            <span className="ak-name">{s.name}</span>
            <span className="ak-excerpt">{s.objective}</span>
          </div>
        ),
      },
      {
        key: "agent",
        header: "Agent",
        sortValue: (s) => describeAssignee(s.assignee),
        render: (s) => (
          <div className="ak-stack">
            <span className="ak-wrap-anywhere">{describeAssignee(s.assignee)}</span>
            <span className="ak-small">{s.budgetUsd === null ? "No budget" : `Budget ${formatUsd(s.budgetUsd)}`}</span>
          </div>
        ),
      },
      {
        key: "cadence",
        header: "Cadence",
        className: "ak-cadence-cell",
        render: (s) => (
          <div className="ak-stack">
            <span>{s.describe}</span>
            <span className="ak-small">
              <code className="ak-cron">{s.cron}</code> · {s.timezone}
            </span>
          </div>
        ),
      },
      {
        key: "next",
        header: "Next run",
        sortValue: (s) => (s.enabled ? timeValue(s.nextRunAt) : null),
        render: (s) => <NextRun enabled={s.enabled} nextRunAt={s.nextRunAt} now={now} />,
      },
      {
        key: "last",
        header: "Last run",
        sortValue: (s) => {
          const t = timeValue(s.lastRunAt);
          return t === null ? null : -t;
        },
        render: (s) =>
          s.lastRunAt ? (
            <div className="ak-stack">
              <time dateTime={s.lastRunAt} title={formatDateTime(s.lastRunAt)} className="ak-nowrap">
                {formatAgo(s.lastRunAt, now)}
              </time>
              {s.lastJob && (
                <Link href={paths.scheduleJob(s.lastJob.jobId)} className="ak-tag-link" aria-label={`Open the last job, ${s.lastJob.jobId}`} scroll={false}>
                  <JobStatusTag status={s.lastJob.status} />
                </Link>
              )}
            </div>
          ) : (
            <span className="ak-muted">Never</span>
          ),
      },
      {
        key: "enabled",
        header: "Enabled",
        sortValue: (s) => (s.enabled ? 0 : 1),
        render: (s) => (
          <div className="ak-controls">
            <Switch checked={s.enabled} label={`Run “${s.name}” on its schedule`} onChange={() => setPending({ action: s.enabled ? "disable" : "enable", schedule: s })} />
            <Button variant="secondary" size="sm" onClick={() => setPending({ action: "run", schedule: s })} aria-label={`Run “${s.name}” now`}>
              <Play size={13} aria-hidden="true" />
              Run now
            </Button>
          </div>
        ),
      },
    ],
    [now],
  );

  const copy = pending ? confirmCopy(pending) : { title: "", text: "", confirmLabel: "", danger: false };

  return (
    <Panel title="Hub schedules" subtitle="The hub posts a job each time one is due." flush inlineActions actions={<IconButton label="Refresh schedules" icon={RefreshCw} />}>
      <div tabIndex={-1} aria-live="polite" className="ak-panel-notice">
        {notice && <p className="ak-done">{notice}</p>}
      </div>
      {rows.length === 0 ? (
        <EmptyState
          bare
          icon={CalendarClock}
          title="No hub schedules yet"
          text="Schedules are added by an operator on the hub. Each one posts a job for an agent when it is due, and shows here."
        />
      ) : (
        <DataTable caption="Schedules the hub runs" columns={columns} rows={rows} rowKey={(s) => s.scheduleId} cards="lg" />
      )}
      <ConfirmDialog
        open={pending !== null}
        title={copy.title}
        text={copy.text}
        confirmLabel={copy.confirmLabel}
        danger={copy.danger}
        onConfirm={() => pending && confirm(pending)}
        onCancel={() => setPending(null)}
      />
    </Panel>
  );
}

function NextRun({ enabled, nextRunAt, now }: { enabled: boolean; nextRunAt: string | null; now: Date }) {
  if (!enabled) return <span className="ak-muted">Off</span>;
  if (!nextRunAt) return <span className="ak-muted">Not scheduled</span>;
  return (
    <div className="ak-stack">
      <time dateTime={nextRunAt} title={formatDateTime(nextRunAt)}>
        {formatWhen(nextRunAt, now)}
      </time>
      <span className="ak-small">{formatUntil(nextRunAt, now)}</span>
    </div>
  );
}

function cronActive(cron: AgentCron): boolean {
  return cron.enabled && cron.state.toLowerCase() !== "paused";
}

function AgentCrons({ crons, now }: { crons: readonly AgentCron[]; now: Date }) {
  const columns = useMemo<Column<AgentCron>[]>(
    () => [
      {
        key: "agent",
        header: "Agent",
        sortValue: (c) => c.agentId,
        render: (c) => (
          <Link href={paths.board(c.agentId)} className="ak-agent-name">
            {c.agentId}
          </Link>
        ),
      },
      {
        key: "name",
        header: "Name",
        primary: true,
        className: "ak-name-cell",
        sortValue: (c) => c.name,
        render: (c) => (
          <div className="ak-stack">
            <span className="ak-name">{c.name}</span>
            {c.description && <span className="ak-excerpt">{c.description}</span>}
          </div>
        ),
      },
      { key: "schedule", header: "Schedule", render: (c) => <code className="ak-cron">{c.schedule}</code> },
      {
        key: "state",
        header: "State",
        sortValue: (c) => (cronActive(c) ? 0 : 1),
        render: (c) => (
          <Pill tone={cronActive(c) ? "green" : "grey"} title={`Worker state: ${c.state}`}>
            {cronActive(c) ? "Active" : "Paused"}
          </Pill>
        ),
      },
      {
        key: "next",
        header: "Next run",
        sortValue: (c) => (cronActive(c) ? timeValue(c.nextRunAt) : null),
        render: (c) => <NextRun enabled={cronActive(c)} nextRunAt={c.nextRunAt} now={now} />,
      },
      {
        key: "last",
        header: "Last run",
        sortValue: (c) => {
          const t = timeValue(c.lastRunAt);
          return t === null ? null : -t;
        },
        render: (c) =>
          c.lastRunAt ? (
            <div className="ak-stack">
              <span className="flex flex-col items-start gap-[3px]">
                <time dateTime={c.lastRunAt} title={formatDateTime(c.lastRunAt)} className="ak-nowrap">
                  {formatAgo(c.lastRunAt, now)}
                </time>
                {c.lastStatus && <Pill tone={cronRunTone(c.lastStatus)}>{c.lastStatus}</Pill>}
              </span>
              {c.lastError && (
                <span className="ak-error-text" title={c.lastError}>
                  {c.lastError}
                </span>
              )}
            </div>
          ) : (
            <span className="ak-muted">Never</span>
          ),
      },
      {
        key: "failures",
        header: "Failures",
        align: "end",
        sortValue: (c) => c.failureStreak,
        render: (c) => (
          <span className={cx(c.failureStreak > 0 && "ak-failures")} title={c.failureStreak > 0 ? `${c.failureStreak} failed runs in a row` : "No failures in a row"}>
            {c.failureStreak}
            {c.runs !== null && <span className="ak-small"> of {c.runs}</span>}
          </span>
        ),
      },
      {
        key: "reported",
        header: "Reported",
        sortValue: (c) => {
          const t = timeValue(c.reportedAt);
          return t === null ? null : -t;
        },
        render: (c) => (
          <time dateTime={c.reportedAt} title={`Reported ${formatDateTime(c.reportedAt)}`} className="ak-muted ak-nowrap text-xs">
            {formatAgo(c.reportedAt, now)}
          </time>
        ),
      },
    ],
    [now],
  );

  return (
    <Panel
      title="On agent computers"
      subtitle="Cron jobs, as each agent's worker last reported them. Change them on the agent's computer."
      flush
      inlineActions
      actions={<IconButton label="Refresh agent cron jobs" icon={RefreshCw} />}
    >
      {crons.length === 0 ? (
        <EmptyState
          bare
          icon={MonitorCog}
          title="No agent has reported its cron jobs yet"
          text="Each worker reports the cron jobs on its computer when it checks in. They show here after the first report."
        />
      ) : (
        <DataTable
          caption="Cron jobs on agent computers"
          columns={columns}
          rows={crons}
          rowKey={(c) => `${c.agentId}/${c.cronId}`}
          initialSort={{ key: "agent", direction: "asc" }}
          cards="lg"
        />
      )}
    </Panel>
  );
}

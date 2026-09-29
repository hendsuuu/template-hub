import { Activity, ArrowRight, Bot, Hand, Inbox, Wallet } from "lucide-react";
import type { DailyActivity, JobListItem } from "../types";
import { buttonClass } from "../lib/buttons";
import { ActivityChart, ActivityTable } from "../components/charts/ActivityChart";
import { DayHistogram } from "../components/charts/DayHistogram";
import { EmptyState } from "../components/EmptyState";
import { JobsTable } from "../components/JobsTable";
import { PageHeader, Panel, PeriodChip } from "../components/Panel";
import { DeltaPill, Pill } from "../components/Pill";
import { Segmented } from "../components/Segmented";
import { ShareBreakdown } from "../components/ShareBreakdown";
import { MiniBars, StatCard, type MiniBar } from "../components/StatCard";
import { NOW, getHub, getJobCounts, getRecentJobs } from "../lib/data";
import { firstName, formatDay, formatUsd, percentChange } from "../lib/format";
import { AGENT_STATUS, isOnline, sortAgents } from "../lib/status";
import { paths } from "../paths";
import { Link } from "../router";
import { AgentsPanel } from "./AgentsPanel";

const sum = (values: readonly number[]) => values.reduce((total, n) => total + n, 0);

export function OverviewPage() {
  const hub = getHub();
  const { agents, activity, spend } = hub;
  const jobs = getJobCounts();
  const name = firstName(hub.user.name);
  const online = agents.filter((a) => isOnline(a.status)).length;
  const working = agents.filter((a) => a.status === "working").length;
  const lastWeek = activity.slice(-7);
  const weekBefore = activity.slice(-14, -7);
  const spendChange =
    weekBefore.length === 7 ? percentChange(sum(lastWeek.map((d) => d.spentUsd)), sum(weekBefore.map((d) => d.spentUsd))) : null;

  const agentBars: MiniBar[] = sortAgents(agents)
    .slice(0, 10)
    .map((a) => ({ value: isOnline(a.status) ? 1 : 0.35, tone: AGENT_STATUS[a.status].tone, title: `${a.agentId}: ${AGENT_STATUS[a.status].label}` }));
  const dayBars = (value: (d: DailyActivity) => number, tone: MiniBar["tone"], unit: (d: DailyActivity) => string): MiniBar[] =>
    lastWeek.map((d) => ({ value: value(d), tone, title: `${formatDay(d.day)}: ${unit(d)}` }));
  const roles = Object.fromEntries(agents.map((a) => [a.agentId, a.role]));

  return (
    <div className="ak-page">
      <PageHeader
        title={name ? `Welcome back, ${name}` : "Welcome back"}
        subtitle="What your agents are doing, and what needs you."
        aside={<PeriodChip>Last 14 days</PeriodChip>}
      />

      <section aria-label="Summary">
        <dl className="grid grid-cols-4 gap-3 @max-[880px]:grid-cols-2 @max-[520px]:grid-cols-1 @max-[520px]:gap-2">
          <StatCard
            icon={Bot}
            label="Agents online"
            value={online}
            suffix={`of ${agents.length}`}
            chart={agentBars.length > 0 ? <MiniBars bars={agentBars} max={1} history={false} /> : undefined}
            meta={
              online === agents.length ? (
                <>
                  <Pill tone="green">All online</Pill>
                  <span>seen in the last {hub.onlineSeconds} s</span>
                </>
              ) : (
                <>
                  <Pill>{agents.length - online} not online</Pill>
                  <span>{agents.length} registered</span>
                </>
              )
            }
          />
          <StatCard
            icon={Activity}
            label="Working now"
            value={working}
            chart={<MiniBars bars={dayBars((d) => d.completed + d.failed, "green", (d) => `${d.completed + d.failed} finished`)} />}
            meta={
              <>
                <Pill tone="blue">{jobs.queued} queued</Pill>
                <span>waiting for pickup</span>
              </>
            }
          />
          <StatCard
            icon={Hand}
            label="Waiting for you"
            value={jobs.waiting}
            attention={jobs.waiting > 0}
            chart={<MiniBars bars={dayBars((d) => d.needsInput, "orange", (d) => `${d.needsInput} needed a person`)} />}
            meta={
              jobs.waiting > 0 ? (
                <>
                  <Pill tone="orange">Needs you</Pill>
                  <Link href={paths.boardWaiting()} className="ak-stat__meta-link">
                    See what is waiting
                  </Link>
                </>
              ) : (
                <>
                  <Pill tone="green">All clear</Pill>
                  <span>nothing is waiting</span>
                </>
              )
            }
          />
          <StatCard
            icon={Wallet}
            label="Spend (7 days)"
            value={formatUsd(spend.last7dUsd)}
            corner={<DeltaPill change={spendChange} against="the 7 days before" />}
            chart={<MiniBars bars={dayBars((d) => d.spentUsd, "blue", (d) => formatUsd(d.spentUsd))} />}
            meta={
              <span>
                Last 24 h: <span className="ak-stat__meta-value">{formatUsd(spend.last24hUsd)}</span>
              </span>
            }
          />
        </dl>
      </section>

      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-3 @max-[880px]:grid-cols-1">
        <ActivityPanel days={activity} />
        <Panel
          title="Work by agent"
          subtitle="Share of jobs started, last 7 days"
          inlineActions
          actions={<span className="ak-total">{sum(hub.workByAgent.map((s) => s.jobs))} jobs</span>}
        >
          <div className="flex flex-col gap-5">
            <DayHistogram days={activity} highlightLast={7} />
            <ShareBreakdown items={hub.workByAgent} roles={roles} />
          </div>
        </Panel>
      </div>

      <AgentsPanel agents={agents} now={NOW} online={online} />
      <RecentJobsPanel jobs={getRecentJobs()} now={NOW} />
    </div>
  );
}

export function ActivityPanel({ days }: { days: readonly DailyActivity[] }) {
  const completed = sum(days.map((d) => d.completed));
  const failed = sum(days.map((d) => d.failed));
  const needsInput = sum(days.map((d) => d.needsInput));
  const spent = sum(days.map((d) => d.spentUsd));

  return (
    <Panel
      title="Activity"
      className="ak-activity"
      subtitle={
        <>
          <span data-ak-mode="jobs">Jobs finished per day, last 14 days (UTC)</span>
          <span data-ak-mode="spend">Known model spend per day, last 14 days (UTC)</span>
        </>
      }
      actions={
        <Segmented
          label="Show"
          name="ak-activity-mode"
          defaultValue="jobs"
          options={[
            { value: "jobs", label: "Jobs" },
            { value: "spend", label: "Spend" },
          ]}
        />
      }
    >
      <div className="ak-headline" data-ak-mode="jobs">
        <p className="ak-big-number">
          {completed + failed} <span className="ak-big-number__unit">finished</span>
        </p>
        <ul className="ak-legend" aria-label="Key">
          <li>
            <span className="ak-swatch ak-swatch--green" aria-hidden="true" />
            Completed <span className="ak-legend__value">{completed}</span>
          </li>
          <li>
            <span className="ak-swatch ak-swatch--red" aria-hidden="true" />
            Failed <span className="ak-legend__value">{failed}</span>
          </li>
          <li>
            <span className="ak-swatch ak-swatch--ring" aria-hidden="true" />
            Needed a person <span className="ak-legend__value">{needsInput}</span>
          </li>
        </ul>
      </div>
      <div className="ak-headline" data-ak-mode="spend">
        <p className="ak-big-number">{formatUsd(spent)}</p>
        <p className="ak-headline__side">
          About <span className="ak-legend__value">{formatUsd(days.length ? spent / days.length : 0)}</span> a day
        </p>
      </div>
      <ActivityChart days={days} mode="jobs" />
      <ActivityChart days={days} mode="spend" />
      <ActivityTable days={days} />
    </Panel>
  );
}

function RecentJobsPanel({ jobs, now }: { jobs: readonly JobListItem[]; now: Date }) {
  return (
    <Panel
      title="Recent jobs"
      subtitle="The latest updates"
      flush
      actions={
        jobs.length > 0 && (
          <Link href={paths.jobs()} className={buttonClass("secondary", "sm")}>
            All jobs <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )
      }
    >
      {jobs.length === 0 ? (
        <EmptyState bare icon={Inbox} title="No jobs yet" text="Jobs show here as soon as an agent or an operator posts one." />
      ) : (
        <JobsTable jobs={jobs} now={now} caption="Recently updated jobs" compact />
      )}
    </Panel>
  );
}

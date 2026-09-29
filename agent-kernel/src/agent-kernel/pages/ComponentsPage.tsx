"use client";

import { useState, type ReactNode } from "react";
import { Ban, Bot, Download, Hand, Play, Plus, RefreshCw, SearchX, Settings, Wallet } from "lucide-react";
import { AGENT_STATUSES, JOB_STATUSES, type BoardColumn } from "../types";
import { AgentsTable } from "../components/AgentsTable";
import { Button, IconButton } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState, ErrorBanner } from "../components/EmptyState";
import { FilterChips, SearchField, SelectField, Switch } from "../components/Fields";
import { PageHeader, Panel, PeriodChip } from "../components/Panel";
import { DeltaPill, Pill } from "../components/Pill";
import { Segmented } from "../components/Segmented";
import { MiniBars, StatCard } from "../components/StatCard";
import { StatusBadge, StatusDot, JobStatusTag } from "../components/StatusBadge";
import { NOW, getAgents, getBoard, getHub } from "../lib/data";
import { Column } from "./BoardPage";
import { ActivityPanel } from "./OverviewPage";
import { Timeline } from "./JobDrawer";

/** Every component of the template in one place, with the classes it is built from. */
export function ComponentsPage() {
  return (
    <div className="ak-page">
      <PageHeader
        title="Components"
        subtitle="Every building block of the template, with the classes it uses. Every colour follows the theme: switch it with the sun or moon in the top bar."
        aside={<PeriodChip>ak-* classes</PeriodChip>}
      />
      <Buttons />
      <div className="grid grid-cols-2 gap-3 @max-[880px]:grid-cols-1">
        <Labels />
        <Statuses />
      </div>
      <Fields />
      <Stats />
      <ActivityPanel days={getHub().activity} />
      <TableSample />
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 @max-[880px]:grid-cols-1">
        <BoardSample />
        <Feedback />
      </div>
    </div>
  );
}

function Classes({ children }: { children: ReactNode }) {
  return <code className="ak-cron">{children}</code>;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-b-0">
      <p className="ak-small w-40 shrink-0">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Buttons() {
  return (
    <Panel title="Buttons" subtitle={<Classes>ak-btn · ak-btn--primary | --secondary | --quiet | --danger · ak-btn--sm · ak-icon-btn</Classes>}>
      <Row label="Variants">
        <Button>
          <Plus size={15} aria-hidden="true" />
          New job
        </Button>
        <Button variant="secondary">
          <Download size={15} aria-hidden="true" />
          Export
        </Button>
        <Button variant="quiet">Clear</Button>
        <Button variant="danger">
          <Ban size={15} aria-hidden="true" />
          Cancel job
        </Button>
      </Row>
      <Row label="Small">
        <Button size="sm">Run now</Button>
        <Button variant="secondary" size="sm">
          <Play size={13} aria-hidden="true" />
          Run now
        </Button>
        <Button variant="quiet" size="sm">
          Show every agent
        </Button>
        <Button size="sm" disabled>
          Disabled
        </Button>
      </Row>
      <Row label="Icon buttons">
        <IconButton label="Refresh" icon={RefreshCw} />
        <IconButton label="Settings" icon={Settings} />
        <IconButton label="Disabled" icon={Bot} disabled />
      </Row>
    </Panel>
  );
}

function Labels() {
  return (
    <Panel title="Pills and changes" subtitle={<Classes>ak-pill · ak-pill--neutral | --blue | --green | --orange | --red | --grey</Classes>}>
      <Row label="Tones">
        <Pill>3 not online</Pill>
        <Pill tone="blue">2 queued</Pill>
        <Pill tone="green">All clear</Pill>
        <Pill tone="orange">Needs you</Pill>
        <Pill tone="red">error</Pill>
        <Pill tone="grey">Paused</Pill>
      </Row>
      <Row label="Change">
        <DeltaPill change={14} against="the 7 days before" />
        <DeltaPill change={-6} against="the 7 days before" />
        <DeltaPill change={0} against="the 7 days before" />
      </Row>
      <Row label="Dots">
        {AGENT_STATUSES.map((status) => (
          <StatusDot key={status} status={status} />
        ))}
      </Row>
    </Panel>
  );
}

function Statuses() {
  return (
    <Panel title="Statuses" subtitle={<Classes>ak-status · ak-dot--&lt;status&gt; · ak-tag · ak-tag--&lt;tone&gt;</Classes>}>
      <Row label="Agents">
        {AGENT_STATUSES.map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </Row>
      <Row label="Jobs">
        {JOB_STATUSES.map((status) => (
          <JobStatusTag key={status} status={status} />
        ))}
      </Row>
    </Panel>
  );
}

function Fields() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [chip, setChip] = useState("all");
  const [on, setOn] = useState(true);
  return (
    <Panel title="Fields" subtitle={<Classes>ak-search · ak-select · ak-segmented · ak-switch · ak-chips · ak-chip</Classes>}>
      <Row label="Search and select">
        <SearchField label="Search agents" value={search} onChange={setSearch} />
        <SelectField label="Status" value={status} onChange={setStatus}>
          <option value="all">Any status</option>
          <option value="working">Working</option>
          <option value="waiting">Waiting for you</option>
        </SelectField>
      </Row>
      <Row label="Segmented">
        <Segmented
          label="Show"
          name="ak-demo-mode"
          defaultValue="jobs"
          options={[
            { value: "jobs", label: "Jobs" },
            { value: "spend", label: "Spend" },
          ]}
        />
      </Row>
      <Row label="Switch">
        <Switch checked={on} label="Run on its schedule" onChange={() => setOn((value) => !value)} />
      </Row>
      <Row label="Filter chips">
        <FilterChips
          label="Show agents by status"
          selected={chip}
          onSelect={setChip}
          chips={[
            { value: "all", label: "All", count: 8 },
            { value: "waiting", label: "Waiting for you", count: 1 },
            { value: "working", label: "Working", count: 2 },
            { value: "paused", label: "Paused", count: 1 },
          ]}
        />
      </Row>
    </Panel>
  );
}

function Stats() {
  const bars = [4, 7, 5, 9, 6, 3, 8].map((value) => ({ value, tone: "green" as const }));
  return (
    <section aria-label="Stat cards">
      <dl className="grid grid-cols-4 gap-3 @max-[880px]:grid-cols-2 @max-[520px]:grid-cols-1">
        <StatCard
          icon={Bot}
          label="Agents online"
          value={5}
          suffix="of 8"
          chart={<MiniBars bars={bars.map((bar, index) => ({ ...bar, tone: index < 5 ? "blue" : "grey" }))} history={false} />}
          meta={<Pill>3 not online</Pill>}
        />
        <StatCard icon={Hand} label="Waiting for you" value={3} attention chart={<MiniBars bars={bars.map((bar) => ({ ...bar, tone: "orange" }))} />} meta={<Pill tone="orange">Needs you</Pill>} />
        <StatCard
          icon={Wallet}
          label="Spend (7 days)"
          value="$6.78"
          corner={<DeltaPill change={14} against="the 7 days before" />}
          chart={<MiniBars bars={bars.map((bar) => ({ ...bar, tone: "blue" }))} />}
          meta={<span>ak-stat · ak-stat--attention · ak-minibars</span>}
        />
        <StatCard icon={Bot} label="Empty" value={0} chart={<MiniBars bars={[0, 0, 0, 0, 0, 0, 0].map((value) => ({ value, tone: "green" as const }))} />} meta={<Pill tone="green">All clear</Pill>} />
      </dl>
    </section>
  );
}

function TableSample() {
  return (
    <Panel title="Data table" subtitle={<Classes>ak-table-wrap · ak-table-wrap--cards-sm | md | lg · ak-table · ak-sort</Classes>} flush>
      <AgentsTable agents={getAgents().slice(0, 4)} now={NOW} caption="A sample of agents" />
    </Panel>
  );
}

function BoardSample() {
  const waiting = getBoard().columns.find((column) => column.key === "waiting") as BoardColumn;
  return (
    <div className="flex flex-col gap-3">
      <p className="ak-small">
        Board column and cards: <Classes>ak-column · ak-card</Classes>
      </p>
      <Column column={{ ...waiting, jobs: waiting.jobs.slice(0, 2) }} recentDays={7} search="" openJobId={null} agent={null} />
    </div>
  );
}

function Feedback() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  return (
    <Panel title="Feedback" subtitle={<Classes>ak-empty · ak-banner · ak-dialog · ak-timeline</Classes>}>
      <div className="flex flex-col gap-4">
        <EmptyState icon={SearchX} title="No agents match" text="Try another status or search.">
          <Button variant="secondary" size="sm">
            Show all agents
          </Button>
        </EmptyState>
        <ErrorBanner action={<Button variant="secondary" size="sm">Try again</Button>}>The hub did not answer. Retrying in 10 seconds.</ErrorBanner>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open a confirmation
          </Button>
          <p className="ak-done" aria-live="polite">
            {notice}
          </p>
        </div>
        <Timeline
          events={[
            { actor: "agent:coordinator-01", from: null, to: "queued", detail: {}, at: "2026-09-28T16:55:04.209Z" },
            { actor: "agent:meetings-01", from: "queued", to: "running", detail: { model: "example-model" }, at: "2026-09-28T16:55:33.915Z" },
            { actor: "agent:meetings-01", from: "running", to: "completed", detail: {}, at: "2026-09-28T16:56:01.543Z" },
          ]}
        />
      </div>
      <ConfirmDialog
        open={open}
        title="Cancel this job?"
        text="The agent stops at its next heartbeat."
        confirmLabel="Cancel job"
        danger
        onConfirm={() => {
          setNotice("The job was cancelled.");
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </Panel>
  );
}

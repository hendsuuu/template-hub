/**
 * The shapes the Agent hub template reads. They mirror the hub's dashboard API,
 * so swapping the bundled JSON for real endpoints is a data change, not a rewrite.
 */

/**
 * An agent's state, most specific first:
 *  - working        holds a job whose lease is current, and heartbeats arrive
 *  - waiting        online, and a job it worked on is waiting for a person
 *  - picking_up     online, and a job for it is queued
 *  - idle           online with nothing to do
 *  - not_responding went quiet while holding a job, or was seen recently but not now
 *  - offline        not seen for longer than that
 *  - never          registered, never connected
 *  - paused         switched off by an operator
 */
export const AGENT_STATUSES = ["working", "waiting", "picking_up", "idle", "not_responding", "offline", "never", "paused"] as const;
export type AgentStatus = (typeof AGENT_STATUSES)[number];

/** The main path is queued → validating → running → verifying → completed; the rest are side states. */
export const JOB_STATUSES = [
  "queued",
  "validating",
  "running",
  "verifying",
  "completed",
  "waiting_for_input",
  "waiting_for_auth",
  "paused_budget",
  "blocked_dependency",
  "failed",
  "cancelled",
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export type DashboardRole = "admin" | "viewer";

export interface DashboardUser {
  name: string;
  email: string;
  /** admin: read everything and cancel or requeue jobs. viewer: read only. */
  role: DashboardRole;
}

export interface AgentJobRef {
  jobId: string;
  status: JobStatus;
  objective: string;
  /** When it entered this state. */
  since: string | null;
  /** Why it is waiting, when it is. */
  reason: string | null;
}

export interface AgentSummary {
  agentId: string;
  role: string;
  status: AgentStatus;
  lastSeenAt: string | null;
  registeredAt: string;
  /** The job it is working on now. */
  currentJob: AgentJobRef | null;
  /** The latest of its jobs that waits for a person. */
  waitingJob: AgentJobRef | null;
  waitingCount: number;
  completed24h: number;
  failed24h: number;
  /** Queued jobs addressed to it or to its role. */
  queuedFor: number;
}

export interface JobCounts {
  queued: number;
  running: number;
  waiting: number;
  completed24h: number;
  failed24h: number;
}

export interface JobListItem {
  jobId: string;
  status: JobStatus;
  /** An agent id, or `role:<role>` for a job any agent of that role may take. */
  assignee: string;
  heldBy: string | null;
  postedBy: string;
  objective: string;
  attempts: number;
  spentUsd: number;
  limitUsd: number | null;
  createdAt: string;
  updatedAt: string;
}

/** One UTC day of activity, for the overview chart. */
export interface DailyActivity {
  /** YYYY-MM-DD (UTC). */
  day: string;
  completed: number;
  failed: number;
  /** Jobs that stopped to wait for a person that day. */
  needsInput: number;
  /** Known model spend that day. */
  spentUsd: number;
}

export interface AgentShare {
  agentId: string;
  /** Jobs the agent started in the period. */
  jobs: number;
}

/**
 * Board columns, left to right:
 *  - queued   waiting for an agent to take it
 *  - working  validating, running or verifying
 *  - waiting  waiting for a person, sign-in, budget or another job
 *  - done     completed (recent days only)
 *  - stopped  failed or cancelled (recent days only)
 */
export const BOARD_COLUMNS = ["queued", "working", "waiting", "done", "stopped"] as const;
export type BoardColumnKey = (typeof BOARD_COLUMNS)[number];

export interface BoardColumn {
  key: BoardColumnKey;
  statuses: JobStatus[];
  /** All matching jobs, even beyond the cards shown. */
  count: number;
  /** Newest first, at most `cardLimit`. */
  jobs: JobListItem[];
}

export interface Board {
  /** The agent filter applied, if any. */
  agent: string | null;
  /** done and stopped cover this many recent days. */
  recentDays: number;
  cardLimit: number;
  columns: BoardColumn[];
}

/** A schedule the hub runs itself: it posts a job each time the cron fires. */
export interface HubSchedule {
  scheduleId: string;
  name: string;
  /** Five-field cron expression, e.g. "0 9 * * 1". */
  cron: string;
  timezone: string;
  /** Plain English, e.g. "At 09:00, only on Monday". */
  describe: string;
  /** An agent id, or `role:<role>`. */
  assignee: string;
  objective: string;
  budgetUsd: number | null;
  enabled: boolean;
  nextRunAt: string | null;
  lastRunAt: string | null;
  lastJob: { jobId: string; status: JobStatus } | null;
}

/** A cron job on an agent's computer, as its worker last reported it. */
export interface AgentCron {
  agentId: string;
  cronId: string;
  name: string;
  /** As the worker shows it, e.g. "every 15m". */
  schedule: string;
  enabled: boolean;
  /** The worker's own state, e.g. "scheduled" or "paused". */
  state: string;
  nextRunAt: string | null;
  lastRunAt: string | null;
  lastStatus: string | null;
  lastError: string | null;
  failureStreak: number;
  runs: number | null;
  /** The start of its prompt or the script it runs. */
  description: string | null;
  reportedAt: string;
}

export interface JobEvent {
  actor: string;
  from: string | null;
  to: string | null;
  detail: Record<string, unknown>;
  at: string;
}

export interface Job {
  jobId: string;
  rootJobId: string;
  parentJobId: string | null;
  postedBy: string;
  assigneeAgentId: string | null;
  assigneeRole: string | null;
  objective: string;
  playbook: { id: string; version: string } | null;
  status: JobStatus;
  attempts: number;
  budget: { limitUsd: number | null; reservedUsd: number; spentUsd: number } | null;
  deadline: string | null;
  lease: { holder: string; generation: number; expiresAt: string } | null;
  result: { summary: string; resultRef?: string | null; evidenceRefs?: string[] } | null;
  blockedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobDetail {
  job: Job;
  events: JobEvent[];
}

/** Everything the template shows, as one snapshot. */
export interface HubSnapshot {
  /** The snapshot's clock: every "5 minutes ago" is measured from here. */
  now: string;
  /** How recently an agent must have called in to count as online. */
  onlineSeconds: number;
  user: DashboardUser;
  tenant: { id: string; name: string };
  agents: AgentSummary[];
  /** Newest first. */
  jobs: JobListItem[];
  /** The last 14 days, oldest first, every day present (zeros included). */
  activity: DailyActivity[];
  spend: { last24hUsd: number; last7dUsd: number };
  /** Share of started jobs per agent over the last 7 days, largest first. */
  workByAgent: AgentShare[];
  board: { recentDays: number; cardLimit: number };
  schedules: { hub: HubSchedule[]; agents: AgentCron[] };
}

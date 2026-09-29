/**
 * How agent and job statuses read on screen. Every status has a text label
 * (colour is never the only signal), a one-line meaning for tooltips and
 * screen readers, and a tone the stylesheet maps to the brand's status colours.
 */
import type { AgentStatus, AgentSummary, JobStatus } from "../types";

/**
 * blue: working · orange: needs a person · green: online and idle ·
 * red: not responding or offline · grey: not connected or paused.
 */
export type AgentTone = "blue" | "orange" | "green" | "red" | "grey";

export interface StatusInfo<T extends string> {
  label: string;
  meaning: string;
  tone: T;
}

// Key order is display order: what needs a person first, then live work.
export const AGENT_STATUS: Readonly<Record<AgentStatus, StatusInfo<AgentTone>>> = {
  waiting: { label: "Waiting for you", meaning: "A job it worked on is waiting for a person.", tone: "orange" },
  working: { label: "Working", meaning: "Holds a job and is sending heartbeats.", tone: "blue" },
  picking_up: { label: "Picking up", meaning: "Online, and a job for it is queued. It takes it within one poll.", tone: "blue" },
  idle: { label: "Idle", meaning: "Online with nothing to do.", tone: "green" },
  not_responding: { label: "Not responding", meaning: "Seen in the last 15 minutes, but not recently.", tone: "red" },
  offline: { label: "Offline", meaning: "Not seen for more than 15 minutes.", tone: "red" },
  never: { label: "Not connected yet", meaning: "Registered, but has never connected to the hub.", tone: "grey" },
  paused: { label: "Paused", meaning: "Switched off by an operator.", tone: "grey" },
};

export const AGENT_STATUS_ORDER = Object.keys(AGENT_STATUS) as AgentStatus[];

/** neutral: not started · blue: in progress · green: done · orange: needs a person · red: failed · grey: set aside. */
export type JobTone = "neutral" | "blue" | "green" | "orange" | "red" | "grey";

// Key order follows the job's path, then the side states.
export const JOB_STATUS: Readonly<Record<JobStatus, StatusInfo<JobTone>>> = {
  queued: { label: "Queued", meaning: "Waiting for an agent to take it.", tone: "neutral" },
  validating: { label: "Checking", meaning: "Being checked before it runs.", tone: "blue" },
  running: { label: "Running", meaning: "An agent is working on it.", tone: "blue" },
  verifying: { label: "Verifying", meaning: "The result is being checked against fresh data.", tone: "blue" },
  completed: { label: "Completed", meaning: "Done, with acceptance evidence.", tone: "green" },
  waiting_for_input: { label: "Waiting for a person", meaning: "Needs a person to answer or check something.", tone: "orange" },
  waiting_for_auth: { label: "Waiting for sign-in", meaning: "Needs someone to sign in to a system.", tone: "orange" },
  paused_budget: { label: "Paused: budget", meaning: "Stopped at its budget limit.", tone: "orange" },
  blocked_dependency: { label: "Blocked", meaning: "Waiting on another job.", tone: "grey" },
  failed: { label: "Failed", meaning: "Stopped and will not be retried on its own.", tone: "red" },
  cancelled: { label: "Cancelled", meaning: "Cancelled by a person.", tone: "grey" },
};

export const JOB_STATUS_ORDER = Object.keys(JOB_STATUS) as JobStatus[];

const ONLINE: ReadonlySet<AgentStatus> = new Set(["working", "waiting", "picking_up", "idle"]);

// Waiting jobs can be requeued once someone has checked them; failed is final.
const REQUEUEABLE: ReadonlySet<JobStatus> = new Set(["waiting_for_input", "waiting_for_auth", "paused_budget", "blocked_dependency"]);

const FINISHED: ReadonlySet<JobStatus> = new Set(["completed", "failed", "cancelled"]);

const WAITING: ReadonlySet<JobStatus> = REQUEUEABLE;

/** Online means it called the hub recently: working, waiting, picking up or idle. */
export function isOnline(status: AgentStatus): boolean {
  return ONLINE.has(status);
}

/** A waiting job can be put back in the queue once someone has checked it. */
export function canRequeue(status: JobStatus): boolean {
  return REQUEUEABLE.has(status);
}

/** Anything not finished can be cancelled. */
export function canCancel(status: JobStatus): boolean {
  return !FINISHED.has(status);
}

/** Waiting for a person, a sign-in, budget or another job. */
export function isWaiting(status: JobStatus): boolean {
  return WAITING.has(status);
}

export function isAgentStatus(value: string | null): value is AgentStatus {
  return value !== null && Object.hasOwn(AGENT_STATUS, value);
}

export function isJobStatus(value: string | null): value is JobStatus {
  return value !== null && Object.hasOwn(JOB_STATUS, value);
}

/** A timeline's from/to may be any string; job statuses get their label. */
export function jobStatusLabel(value: string): string {
  return isJobStatus(value) ? JOB_STATUS[value].label : value;
}

/** Needs-a-person first, then live work, then the rest; by id within a status. */
export function sortAgents(agents: readonly AgentSummary[]): AgentSummary[] {
  const rank = (s: AgentStatus) => AGENT_STATUS_ORDER.indexOf(s);
  return [...agents].sort((a, b) => rank(a.status) - rank(b.status) || a.agentId.localeCompare(b.agentId));
}

export function countByStatus(agents: readonly AgentSummary[]): Record<AgentStatus, number> {
  const counts = Object.fromEntries(AGENT_STATUS_ORDER.map((s) => [s, 0])) as Record<AgentStatus, number>;
  for (const agent of agents) counts[agent.status] += 1;
  return counts;
}

/** Position in the display order, for sorting a table by status. */
export function agentStatusRank(status: AgentStatus): number {
  return AGENT_STATUS_ORDER.indexOf(status);
}

/** An agent cron's own words ("ok", "error", …) as a tone: good, bad or unknown. */
export function cronRunTone(lastStatus: string | null): JobTone {
  if (!lastStatus) return "grey";
  const s = lastStatus.toLowerCase();
  if (["ok", "success", "succeeded", "completed", "done"].includes(s)) return "green";
  if (["error", "failed", "failure", "timeout", "timed_out"].includes(s)) return "red";
  return "neutral";
}

/** An agent matches when its id or role contains every word of the search. */
export function matchesAgent(agent: AgentSummary, search: string): boolean {
  const text = `${agent.agentId} ${agent.role}`.toLowerCase();
  return search
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}

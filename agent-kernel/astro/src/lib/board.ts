/**
 * The kanban board's columns as they read on screen, and the board itself,
 * worked out from the job list the way the hub does it.
 */
import type { AgentSummary, Board, BoardColumnKey, JobListItem, JobStatus } from "./types";
import { BOARD_COLUMNS } from "./types";
import { describeAssignee } from "./jobs";

export interface BoardColumnInfo {
  label: string;
  /** Which job statuses belong in the column. */
  statuses: JobStatus[];
  /** Shown when the column has no cards. */
  empty: string;
  /** done and stopped only cover recent days. */
  recentOnly: boolean;
}

// Key order is the order of the columns, left to right.
export const BOARD_COLUMN: Readonly<Record<BoardColumnKey, BoardColumnInfo>> = {
  queued: { label: "Queued", statuses: ["queued"], empty: "Nothing is waiting for an agent.", recentOnly: false },
  working: { label: "Working", statuses: ["validating", "running", "verifying"], empty: "No agent is working on a job right now.", recentOnly: false },
  waiting: {
    label: "Waiting for you",
    statuses: ["waiting_for_input", "waiting_for_auth", "paused_budget", "blocked_dependency"],
    empty: "Nothing is waiting for a person.",
    recentOnly: false,
  },
  done: { label: "Done", statuses: ["completed"], empty: "Nothing was completed in this period.", recentOnly: true },
  stopped: { label: "Stopped", statuses: ["failed", "cancelled"], empty: "Nothing failed or was cancelled in this period.", recentOnly: true },
};

export function isBoardColumn(value: string): value is BoardColumnKey {
  return Object.hasOwn(BOARD_COLUMN, value);
}

/** Cards whose id, objective or assignee contains every word of the search, ignoring case. */
export function filterCards(jobs: readonly JobListItem[], search: string): JobListItem[] {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...jobs];
  return jobs.filter((job) => {
    const text = [job.jobId, job.objective, describeAssignee(job.assignee), job.heldBy ?? ""].join(" ").toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

interface BuildBoardOptions {
  jobs: readonly JobListItem[];
  agents: readonly AgentSummary[];
  /** Only this agent's jobs: addressed to it, held by it, or queued for its role. */
  agent: string | null;
  now: Date;
  recentDays: number;
  cardLimit: number;
}

/** The five columns, newest card first; done and stopped cover `recentDays` only. */
export function buildBoard({ jobs, agents, agent, now, recentDays, cardLimit }: BuildBoardOptions): Board {
  const since = now.getTime() - recentDays * 24 * 60 * 60 * 1000;
  const role = agents.find((a) => a.agentId === agent)?.role;
  const forAgent = (job: JobListItem) =>
    !agent || job.assignee === agent || job.heldBy === agent || (job.status === "queued" && role !== undefined && job.assignee === `role:${role}`);
  const newestFirst = [...jobs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return {
    agent,
    recentDays,
    cardLimit,
    columns: BOARD_COLUMNS.map((key) => {
      const { statuses, recentOnly } = BOARD_COLUMN[key];
      const matching = newestFirst.filter(
        (job) => statuses.includes(job.status) && forAgent(job) && (!recentOnly || new Date(job.updatedAt).getTime() >= since),
      );
      return { key, statuses, count: matching.length, jobs: matching.slice(0, cardLimit) };
    }),
  };
}

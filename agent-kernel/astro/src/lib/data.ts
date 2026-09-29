/**
 * The template's data. Everything comes from one bundled snapshot so the pages
 * render the same on the server, in the browser and in every framework port.
 * Replace these functions with API calls when you connect a real backend.
 */
import hubJson from "../data/hub.json";
import type { AgentSummary, Board, HubSnapshot, JobCounts, JobListItem } from "./types";
import { buildBoard } from "./board";
import { isWaiting } from "./status";

const hub = hubJson as HubSnapshot;

/** The snapshot's clock. Relative times ("5 minutes ago") are measured from it. */
export const NOW = new Date(hub.now);

export function getHub(): HubSnapshot {
  return hub;
}

export function getAgents(): AgentSummary[] {
  return hub.agents;
}

/** Newest first. */
export function getJobs(): JobListItem[] {
  return hub.jobs;
}

/** The latest updates, for the overview. */
export function getRecentJobs(limit = 8): JobListItem[] {
  return hub.jobs.slice(0, limit);
}

export function getJobCounts(): JobCounts {
  const dayAgo = NOW.getTime() - 24 * 60 * 60 * 1000;
  const recent = (job: JobListItem) => new Date(job.updatedAt).getTime() >= dayAgo;
  return {
    queued: hub.jobs.filter((j) => j.status === "queued").length,
    running: hub.jobs.filter((j) => j.status === "validating" || j.status === "running" || j.status === "verifying").length,
    waiting: hub.jobs.filter((j) => isWaiting(j.status)).length,
    completed24h: hub.jobs.filter((j) => j.status === "completed" && recent(j)).length,
    failed24h: hub.jobs.filter((j) => j.status === "failed" && recent(j)).length,
  };
}

export function getBoard(agent: string | null = null): Board {
  return buildBoard({ jobs: hub.jobs, agents: hub.agents, agent, now: NOW, ...hub.board });
}

export function getSchedules(): HubSnapshot["schedules"] {
  return hub.schedules;
}

// The workshop's getJobDetail() reads data/job-details.json, which this starter
// leaves out along with the job pages. Bring both back when you build them.

/** Every job id, for pre-rendering job pages. */
export function getJobIds(): string[] {
  return hub.jobs.map((job) => job.jobId);
}

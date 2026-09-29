import type { Job } from "./types";

/** A list assignee is an agent id or `role:<role>`. */
export function describeAssignee(assignee: string): string {
  return assignee.startsWith("role:") ? `Any ${assignee.slice("role:".length)} agent` : assignee;
}

export function describeJobAssignee(job: Pick<Job, "assigneeAgentId" | "assigneeRole">): string {
  if (job.assigneeAgentId) return job.assigneeAgentId;
  return job.assigneeRole ? `Any ${job.assigneeRole} agent` : "No one";
}

/** "agent:leads-01" → "leads-01", "dashboard:alex@example.test" → "alex@example.test". */
export function describeActor(actor: string): string {
  const colon = actor.indexOf(":");
  return colon === -1 ? actor : actor.slice(colon + 1);
}

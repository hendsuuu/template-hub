/**
 * Every address in the template, from one base. In the workshop the template
 * lives under /agent-kernel; in a starter it is the whole app, so BASE is "".
 */
export const BASE = "";

const job = (section: string, jobId: string) => `${BASE}/${section}/${encodeURIComponent(jobId)}`;

export const paths = {
  overview: () => BASE || "/",
  agents: () => `${BASE}/agents`,
  board: (agent?: string | null) => `${BASE}/board${agent ? `?agent=${encodeURIComponent(agent)}` : ""}`,
  boardWaiting: () => `${BASE}/board#waiting`,
  boardJob: (jobId: string, agent?: string | null) => `${job("board", jobId)}${agent ? `?agent=${encodeURIComponent(agent)}` : ""}`,
  jobs: () => `${BASE}/jobs`,
  job: (jobId: string) => job("jobs", jobId),
  schedules: () => `${BASE}/schedules`,
  scheduleJob: (jobId: string) => job("schedules", jobId),
  login: () => `${BASE}/login`,
  components: () => `${BASE}/components`,
};

/** The job id in a drawer address such as /jobs/job_123, or null. */
export function openJobIdFrom(pathname: string, section: "board" | "jobs" | "schedules"): string | null {
  const prefix = `${BASE}/${section}/`;
  if (!pathname.startsWith(prefix)) return null;
  const rest = pathname.slice(prefix.length).split("/")[0];
  return rest ? decodeURIComponent(rest) : null;
}

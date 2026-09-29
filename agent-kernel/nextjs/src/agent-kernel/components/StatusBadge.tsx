import type { AgentStatus, JobStatus } from "../types";
import { cx } from "../lib/cx";
import { AGENT_STATUS, JOB_STATUS } from "../lib/status";

/** The dot alone. Every status has its own shape, so colour is never the only cue. */
export function StatusDot({ status, className }: { status: AgentStatus; className?: string | undefined }) {
  return <span className={cx("ak-dot", `ak-dot--${status}`, className)} aria-hidden="true" />;
}

/** An agent's status: a shaped dot, the label, and its meaning for assistive tech. */
export function StatusBadge({ status }: { status: AgentStatus }) {
  const info = AGENT_STATUS[status];
  return (
    <span className={cx("ak-status", `ak-status--${info.tone}`)} title={info.meaning}>
      <StatusDot status={status} />
      {info.label}
      <span className="sr-only">. {info.meaning}</span>
    </span>
  );
}

/** A job's status as a small tag with a leading mark. */
export function JobStatusTag({ status }: { status: JobStatus }) {
  const info = JOB_STATUS[status];
  return (
    <span className={cx("ak-tag", `ak-tag--${info.tone}`)} title={info.meaning}>
      <span className="ak-tag__mark" aria-hidden="true" />
      {info.label}
    </span>
  );
}

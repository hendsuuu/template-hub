"use client";

import { useMemo } from "react";
import type { JobListItem } from "../types";
import { formatAgo, formatDateTime, formatUsd } from "../lib/format";
import { describeAssignee } from "../lib/jobs";
import { timeValue } from "../lib/sort";
import { JOB_STATUS_ORDER } from "../lib/status";
import { paths } from "../paths";
import { Link, useNavigate } from "../router";
import { DataTable, type Column } from "./DataTable";
import { JobStatusTag } from "./StatusBadge";

interface JobsTableProps {
  jobs: readonly JobListItem[];
  now: Date;
  caption: string;
  /** Which page's drawer a job opens in. */
  section?: "jobs" | "board" | "schedules";
  /** The job whose drawer is open. */
  openJobId?: string | null | undefined;
  /** Fewer columns and denser rows, for the overview. */
  compact?: boolean;
}

const HREF = { jobs: paths.job, board: paths.boardJob, schedules: paths.scheduleJob } as const;

/** Jobs as a sortable table. The job is the link; the whole row opens it too. */
export function JobsTable({ jobs, now, caption, section = "jobs", openJobId, compact = false }: JobsTableProps) {
  const navigate = useNavigate();
  const hrefFor = HREF[section];
  const columns = useMemo<Column<JobListItem>[]>(() => {
    const all: Array<Column<JobListItem> | false> = [
      {
        key: "job",
        header: "Job",
        primary: true,
        className: "ak-job-cell",
        sortValue: (j) => j.objective,
        render: (j) => (
          <Link href={hrefFor(j.jobId)} className="ak-job-link">
            <span className="ak-job-link__id">{j.jobId}</span>
            <span className="ak-job-link__objective">{j.objective}</span>
          </Link>
        ),
      },
      {
        key: "agent",
        header: "Agent",
        sortValue: (j) => describeAssignee(j.heldBy ?? j.assignee),
        render: (j) => <span className="ak-wrap-anywhere">{describeAssignee(j.heldBy ?? j.assignee)}</span>,
      },
      { key: "status", header: "Status", sortValue: (j) => JOB_STATUS_ORDER.indexOf(j.status), render: (j) => <JobStatusTag status={j.status} /> },
      !compact && { key: "attempts", header: "Attempts", align: "end", sortValue: (j) => j.attempts, render: (j) => j.attempts },
      {
        key: "spent",
        header: "Spent",
        align: "end",
        sortValue: (j) => j.spentUsd,
        render: (j) => (
          <span className="ak-nowrap">
            {formatUsd(j.spentUsd)}
            {!compact && j.limitUsd !== null && <span className="ak-limit">of {formatUsd(j.limitUsd)}</span>}
          </span>
        ),
      },
      {
        key: "updated",
        header: "Updated",
        sortValue: (j) => {
          const t = timeValue(j.updatedAt);
          return t === null ? null : -t;
        },
        render: (j) => (
          <time dateTime={j.updatedAt} title={formatDateTime(j.updatedAt)} className="ak-updated">
            {formatAgo(j.updatedAt, now)}
          </time>
        ),
      },
    ];
    return all.filter((c): c is Column<JobListItem> => c !== false);
  }, [compact, hrefFor, now]);

  return (
    <DataTable
      caption={caption}
      columns={columns}
      rows={jobs}
      rowKey={(j) => j.jobId}
      onRowClick={(j) => navigate(hrefFor(j.jobId))}
      isRowCurrent={openJobId ? (j) => j.jobId === openJobId : undefined}
      cards={compact ? "sm" : "md"}
      compact={compact}
    />
  );
}

"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Ban, FileQuestion, RotateCcw, X } from "lucide-react";
import type { Job, JobDetail, JobEvent } from "../types";
import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { JobStatusTag } from "../components/StatusBadge";
import { cx } from "../lib/cx";
import { formatBudget, formatDateTime } from "../lib/format";
import { describeJobAssignee } from "../lib/jobs";
import { JOB_STATUS, canCancel, canRequeue, jobStatusLabel } from "../lib/status";
import { useNavigate } from "../router";

type Action = "cancel" | "requeue";

const CONFIRM: Record<Action, { title: string; text: string; confirmLabel: string; done: string }> = {
  cancel: {
    title: "Cancel this job?",
    text: "The agent stops at its next heartbeat.",
    confirmLabel: "Cancel job",
    done: "The job was cancelled.",
  },
  requeue: {
    title: "Requeue this job?",
    text: "Check the target system first: a waiting job may have half-finished work.",
    confirmLabel: "Requeue job",
    done: "The job is back in the queue.",
  },
};

interface JobDrawerProps {
  jobId: string;
  /** null when no job has that id. */
  detail: JobDetail | null;
  /** Where closing the drawer goes: the page it was opened over. */
  closeHref: string;
}

/** A job's details in a drawer over the page that opened it (full screen on phones). */
export function JobDrawer({ jobId, detail, closeHref }: JobDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const navigate = useNavigate();
  const close = () => navigate(closeHref);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="ak-job-drawer"
      aria-labelledby={titleId}
      onClose={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) ref.current?.close();
      }}
    >
      <div className="ak-job-drawer__panel">
        <header className="ak-job-drawer__header">
          <div className="ak-job-drawer__heading">
            <p className="ak-job-drawer__eyebrow">{jobId}</p>
            <h2 id={titleId} className="ak-job-drawer__title">
              {detail ? detail.job.objective : "Job details"}
            </h2>
          </div>
          <button type="button" className="ak-icon-btn" onClick={() => ref.current?.close()} aria-label="Close job details" title="Close job details">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {detail ? (
          <JobBody key={detail.job.jobId} detail={detail} />
        ) : (
          <div className="ak-job-drawer__body">
            <EmptyState icon={FileQuestion} title="This job could not be found" text="It may belong to another organisation, or the link is wrong." />
          </div>
        )}
      </div>
    </dialog>
  );
}

function JobBody({ detail }: { detail: JobDetail }) {
  const { job, events } = detail;
  return (
    <>
      <div className="ak-job-drawer__body">
        <div className="ak-job-status">
          <JobStatusTag status={job.status} />
          <p className="ak-job-status__meaning">{JOB_STATUS[job.status].meaning}</p>
        </div>

        {job.blockedReason && (
          <div className={cx("ak-reason", JOB_STATUS[job.status].tone === "red" && "ak-reason--failed")}>
            <p className="ak-reason__label">Why it stopped</p>
            <p>{job.blockedReason}</p>
          </div>
        )}

        <JobFacts job={job} />
        {job.result && <JobResult job={job} />}
        <Timeline events={events} />
      </div>
      <Actions job={job} />
    </>
  );
}

function JobFacts({ job }: { job: Job }) {
  const facts: Array<[string, ReactNode]> = [
    ["Assigned to", describeJobAssignee(job)],
    ["Held by", job.lease?.holder ?? "No one"],
    ["Posted by", job.postedBy],
    ["Attempts", job.attempts],
    ["Budget", job.budget ? formatBudget(job.budget.spentUsd, job.budget.limitUsd) : "No budget set"],
    ["Created", formatDateTime(job.createdAt)],
    ["Updated", formatDateTime(job.updatedAt)],
  ];
  if (job.deadline) facts.push(["Deadline", formatDateTime(job.deadline)]);
  if (job.playbook) facts.push(["Playbook", `${job.playbook.id} ${job.playbook.version}`]);
  if (job.parentJobId) facts.push(["Part of", job.parentJobId]);

  return (
    <section aria-label="Details">
      <dl className="ak-facts ak-bracketed">
        {facts.map(([label, value]) => (
          <div key={label} className="ak-fact">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Only plain https links are made clickable; anything else is shown as text. */
function Reference({ value }: { value: string }) {
  let url: URL | null = null;
  try {
    url = new URL(value);
  } catch {
    url = null;
  }
  if (url?.protocol === "https:") {
    return (
      <a href={url.href} target="_blank" rel="noreferrer noopener" className="ak-inline-link">
        {value}
      </a>
    );
  }
  return <code className="ak-code">{value}</code>;
}

function JobResult({ job }: { job: Job }) {
  const result = job.result;
  if (!result) return null;
  const evidence = result.evidenceRefs ?? [];
  return (
    <section className="ak-section">
      <h3 className="ak-section__title">Result</h3>
      {result.summary && <p className="ak-summary">{result.summary}</p>}
      {result.resultRef && (
        <div className="ak-fact">
          <p className="ak-small-label">Result reference</p>
          <Reference value={result.resultRef} />
        </div>
      )}
      {evidence.length > 0 && (
        <div className="ak-fact">
          <p className="ak-small-label">Evidence</p>
          <ul className="flex flex-col gap-1">
            {evidence.map((ref) => (
              <li key={ref}>
                <Reference value={ref} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function Timeline({ events }: { events: readonly JobEvent[] }) {
  const newestFirst = [...events].reverse();
  return (
    <section className="ak-section">
      <h3 className="ak-section__title">
        Timeline <span className="ak-section__note">newest first</span>
      </h3>
      {newestFirst.length === 0 ? (
        <p className="ak-muted">Nothing has happened to this job yet.</p>
      ) : (
        <ol className="ak-timeline">
          {newestFirst.map((event, index) => (
            <li key={`${event.at}-${index}`} className="ak-event">
              <div className="ak-event__head">
                <time dateTime={event.at} className="ak-event__time">
                  {formatDateTime(event.at)}
                </time>
                <span className="ak-event__actor">{event.actor}</span>
              </div>
              {(event.from || event.to) && (
                <p className="ak-event__transition">
                  {event.from ? jobStatusLabel(event.from) : "New"}
                  <span aria-hidden="true"> → </span>
                  <span className="sr-only"> to </span>
                  {event.to ? jobStatusLabel(event.to) : "–"}
                </p>
              )}
              {Object.keys(event.detail).length > 0 && (
                <details className="ak-event__detail">
                  <summary>Details</summary>
                  <pre>{JSON.stringify(event.detail, null, 2)}</pre>
                </details>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/** Requeue and cancel. The template only shows the outcome; connect them to your API. */
function Actions({ job }: { job: Job }) {
  const [confirming, setConfirming] = useState<Action | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const requeue = canRequeue(job.status);
  const cancel = canCancel(job.status);
  if (!requeue && !cancel && !notice) return null;

  const copy = CONFIRM[confirming ?? "cancel"];
  return (
    <footer className="ak-drawer-actions">
      <div tabIndex={-1} aria-live="polite" className="ak-notice">
        {notice && <p className="ak-done">{notice}</p>}
      </div>
      {(requeue || cancel) && !notice && (
        <div className="ak-drawer-actions__buttons">
          {requeue && (
            <Button variant="secondary" onClick={() => setConfirming("requeue")}>
              <RotateCcw size={15} aria-hidden="true" />
              Requeue
            </Button>
          )}
          {cancel && (
            <Button variant="secondary" onClick={() => setConfirming("cancel")}>
              <Ban size={15} aria-hidden="true" />
              Cancel job
            </Button>
          )}
        </div>
      )}
      <ConfirmDialog
        open={confirming !== null}
        title={copy.title}
        text={copy.text}
        confirmLabel={copy.confirmLabel}
        danger={confirming === "cancel"}
        onConfirm={() => {
          if (confirming) setNotice(CONFIRM[confirming].done);
          setConfirming(null);
        }}
        onCancel={() => setConfirming(null)}
      />
    </footer>
  );
}

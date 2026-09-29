"use client";

import { useState, type ReactNode } from "react";
import { Inbox, RefreshCw, SearchX } from "lucide-react";
import type { JobListItem, JobStatus } from "../types";
import { Button, IconButton } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { SearchField, SelectField } from "../components/Fields";
import { JobsTable } from "../components/JobsTable";
import { PageHeader, Panel } from "../components/Panel";
import { filterCards } from "../lib/board";
import { NOW, getAgents, getJobs } from "../lib/data";
import { JOB_STATUS, JOB_STATUS_ORDER, isJobStatus } from "../lib/status";
import { openJobIdFrom } from "../paths";
import { usePathname } from "../router";

/** Every job, with a search and status and agent filters. A job's drawer arrives as `children`. */
export function JobsPage({ children }: { children?: ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [agent, setAgent] = useState("");
  const openJobId = openJobIdFrom(pathname, "jobs");
  const agentIds = getAgents()
    .map((a) => a.agentId)
    .sort((a, b) => a.localeCompare(b));

  const all = getJobs();
  const rows = filterCards(all, search).filter(
    (job: JobListItem) => (!status || job.status === status) && (!agent || job.assignee === agent || job.heldBy === agent),
  );
  const filtered = search !== "" || status !== "" || agent !== "";
  const clear = () => {
    setSearch("");
    setStatus("");
    setAgent("");
  };

  return (
    <>
      <div className="ak-page">
        <PageHeader title="All jobs" subtitle="Find any job by its id or objective, and filter by status or agent." />
        <Panel
          title="Jobs"
          subtitle={`${rows.length} shown, most recently updated first`}
          flush
          actions={
            <>
              <SearchField label="Search jobs by id or objective" placeholder="Search jobs" value={search} onChange={setSearch} />
              <SelectField label="Status" value={status} onChange={(value) => setStatus(isJobStatus(value) ? value : "")}>
                <option value="">Any status</option>
                {JOB_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {JOB_STATUS[s].label}
                  </option>
                ))}
              </SelectField>
              <SelectField label="Agent" value={agent} onChange={setAgent}>
                <option value="">All agents</option>
                {agentIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </SelectField>
              {filtered && (
                <Button variant="quiet" size="sm" onClick={clear}>
                  Clear
                </Button>
              )}
              <IconButton label="Refresh jobs" icon={RefreshCw} />
            </>
          }
        >
          {all.length === 0 ? (
            <EmptyState bare icon={Inbox} title="No jobs yet" text="Jobs show here as soon as an agent or an operator posts one." />
          ) : rows.length === 0 ? (
            <EmptyState bare icon={SearchX} title="No jobs match" text="Try other words, another status or another agent.">
              <Button variant="secondary" size="sm" onClick={clear}>
                Clear the search and filters
              </Button>
            </EmptyState>
          ) : (
            <>
              <p className="sr-only" aria-live="polite">
                {rows.length === 1 ? "1 job shown" : `${rows.length} jobs shown`}
              </p>
              <JobsTable jobs={rows} now={NOW} caption="Jobs, most recently updated first" openJobId={openJobId} />
            </>
          )}
        </Panel>
      </div>
      {children}
    </>
  );
}

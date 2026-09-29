"use client";

import { useId, useState, type ReactNode } from "react";
import { Bot, RefreshCw, RotateCcw } from "lucide-react";
import type { BoardColumn, JobListItem } from "../types";
import { Button, IconButton } from "../components/Button";
import { SearchField, SelectField } from "../components/Fields";
import { PageHeader } from "../components/Panel";
import { JobStatusTag } from "../components/StatusBadge";
import { BOARD_COLUMN, filterCards } from "../lib/board";
import { cx } from "../lib/cx";
import { NOW, getAgents, getBoard } from "../lib/data";
import { formatAgo, formatAgoShort, formatDateTime, formatUsd } from "../lib/format";
import { openJobIdFrom, paths } from "../paths";
import { Link, useNavigate, usePathname, useSearchParam } from "../router";

/** The board, filtered by the ?agent= in the address. On a prerendered page, render it inside <Suspense>. */
export function BoardFromUrl({ children }: { children?: ReactNode }) {
  return <BoardPage agent={useSearchParam("agent")}>{children}</BoardPage>;
}

/**
 * The kanban board, for every agent or for one. A card opens the job's drawer
 * over it, which arrives as `children` (a nested route).
 */
export function BoardPage({ agent, children }: { agent: string | null; children?: ReactNode }) {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const board = getBoard(agent);
  const openJobId = openJobIdFrom(pathname, "board");
  const agentIds = getAgents()
    .map((a) => a.agentId)
    .sort((a, b) => a.localeCompare(b));
  const shownCount = board.columns.reduce((n, c) => n + filterCards(c.jobs, search).length, 0);

  const setAgent = (value: string) => navigate(paths.board(value || null), { replace: true });

  return (
    <>
      <div className="ak-page">
        <PageHeader
          title={agent ? `Board for ${agent}` : "Job board"}
          subtitle="Every job by where it stands. Open a card for its details and actions."
          aside={
            <div className="ak-toolbar">
              <SelectField label="Agent" value={agent ?? ""} onChange={setAgent} className="min-w-[170px]">
                <option value="">All agents</option>
                {agentIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </SelectField>
              <SearchField label="Search the cards" placeholder="Search cards" value={search} onChange={setSearch} />
              <IconButton label="Refresh the board" icon={RefreshCw} />
            </div>
          }
        />
        {agent && (
          <div className="ak-filter-note">
            <p>
              Showing jobs for or worked on by <strong>{agent}</strong>.
            </p>
            <Button variant="quiet" size="sm" onClick={() => setAgent("")}>
              Show every agent
            </Button>
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {search ? (shownCount === 1 ? "1 card matches" : `${shownCount} cards match`) : ""}
        </p>
        <div className="ak-board" role="region" aria-label="Board columns" tabIndex={0}>
          <div className="ak-board__columns">
            {board.columns.map((column) => (
              <Column key={column.key} column={column} recentDays={board.recentDays} search={search} openJobId={openJobId} agent={agent} />
            ))}
          </div>
        </div>
      </div>
      {children}
    </>
  );
}

interface ColumnProps {
  column: BoardColumn;
  recentDays: number;
  search: string;
  openJobId: string | null;
  agent: string | null;
}

export function Column({ column, recentDays, search, openJobId, agent }: ColumnProps) {
  const headingId = useId();
  const info = BOARD_COLUMN[column.key];
  const cards = filterCards(column.jobs, search);
  const notes: string[] = [];
  if (info.recentOnly) notes.push(`last ${recentDays} days`);
  if (column.count > column.jobs.length) notes.push(`newest ${column.jobs.length} of ${column.count}`);
  if (search) notes.push(`${cards.length} ${cards.length === 1 ? "matches" : "match"}`);

  return (
    <section id={column.key} aria-labelledby={headingId} className={cx("ak-column", `ak-column--${column.key}`)}>
      <header className="ak-column__head">
        <h2 id={headingId} tabIndex={-1} className="ak-column__title">
          <span className="ak-column__mark" aria-hidden="true" />
          {info.label}
          <span className="sr-only">
            , {column.count} {column.count === 1 ? "job" : "jobs"}
          </span>
        </h2>
        <span className={cx("ak-column__count", column.key === "waiting" && column.count > 0 && "ak-column__count--attention")} aria-hidden="true">
          {column.count}
        </span>
      </header>
      {notes.length > 0 && <p className="ak-column__note">{notes.join(" · ")}</p>}
      {cards.length === 0 ? (
        <p className="ak-column__empty">{search ? "No cards match the search." : info.empty}</p>
      ) : (
        <ul className="ak-column__cards">
          {cards.map((job) => (
            <li key={job.jobId}>
              <JobCard job={job} open={job.jobId === openJobId} agent={agent} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Who the card is for: the agent holding it, the agent it is addressed to, or "Any <role>". */
function assigneeText(job: JobListItem): string {
  if (job.heldBy) return job.heldBy;
  return job.assignee.startsWith("role:") ? `Any ${job.assignee.slice("role:".length)}` : job.assignee;
}

export function JobCard({ job, open, agent }: { job: JobListItem; open: boolean; agent: string | null }) {
  const spend = job.limitUsd === null ? formatUsd(job.spentUsd) : `${formatUsd(job.spentUsd)} / ${formatUsd(job.limitUsd)}`;
  return (
    <Link href={paths.boardJob(job.jobId, agent)} className="ak-card" aria-current={open ? "true" : undefined} scroll={false}>
      <span className="ak-card__row">
        <span className="ak-card__id">{job.jobId}</span>
        <time dateTime={job.updatedAt} title={`Updated ${formatDateTime(job.updatedAt)} (${formatAgo(job.updatedAt, NOW)})`} className="ak-card__time">
          <span className="sr-only">, updated </span>
          {formatAgoShort(job.updatedAt, NOW)}
        </time>
      </span>
      <span className="ak-card__objective">{job.objective}</span>
      <span className="ak-card__assignee">
        <Bot size={12} aria-hidden="true" />
        <span className="sr-only">For </span>
        <span className="ak-truncate">{assigneeText(job)}</span>
      </span>
      <span className="ak-card__foot">
        <JobStatusTag status={job.status} />
        <span className="ak-card__meta">
          <span className="ak-card__attempts" title={job.attempts === 1 ? "1 attempt" : `${job.attempts} attempts`}>
            <RotateCcw size={11} aria-hidden="true" />
            {job.attempts}
            <span className="sr-only"> {job.attempts === 1 ? "attempt" : "attempts"}, </span>
          </span>
          <span title={job.limitUsd === null ? "Spent, no limit" : "Spent of its limit"}>
            <span className="sr-only">spent </span>
            {spend}
          </span>
        </span>
      </span>
    </Link>
  );
}

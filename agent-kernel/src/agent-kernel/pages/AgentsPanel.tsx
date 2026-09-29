"use client";

import { useState } from "react";
import { ArrowUpRight, Bot, RefreshCw, SearchX } from "lucide-react";
import type { AgentStatus, AgentSummary } from "../types";
import { AgentsTable } from "../components/AgentsTable";
import { Button, IconButton } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { SearchField, SelectField } from "../components/Fields";
import { Panel } from "../components/Panel";
import { AGENT_STATUS, AGENT_STATUS_ORDER, countByStatus, isAgentStatus, matchesAgent } from "../lib/status";
import { paths } from "../paths";
import { Link } from "../router";

type StatusFilter = AgentStatus | "all";

/** The overview's agents table, with a search and a status filter. */
export function AgentsPanel({ agents, now, online }: { agents: readonly AgentSummary[]; now: Date; online: number }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const counts = countByStatus(agents);
  const shown = agents.filter((a) => (status === "all" || a.status === status) && matchesAgent(a, search));
  const filtered = status !== "all" || search !== "";

  return (
    <Panel
      title="Agents"
      subtitle={`${agents.length} registered · ${online} online`}
      flush
      actions={
        <>
          <SearchField label="Search agents" value={search} onChange={setSearch} />
          <SelectField label="Show agents by status" value={status} onChange={(value) => setStatus(isAgentStatus(value) ? value : "all")}>
            <option value="all">Any status</option>
            {AGENT_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {AGENT_STATUS[s].label} ({counts[s]})
              </option>
            ))}
          </SelectField>
          <IconButton label="Refresh agents" icon={RefreshCw} />
          <Link href={paths.agents()} className="ak-icon-btn" aria-label="Open the agents page" title="Open the agents page">
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </>
      }
    >
      <p className="sr-only" aria-live="polite">
        {filtered ? (shown.length === 1 ? "1 agent shown" : `${shown.length} agents shown`) : ""}
      </p>
      {agents.length === 0 ? (
        <EmptyState bare icon={Bot} title="No agents yet" text="Agents appear here once an operator registers them on the hub." />
      ) : shown.length === 0 ? (
        <EmptyState bare icon={SearchX} title="No agents match" text="Try another status or search.">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatus("all");
            }}
          >
            Show all agents
          </Button>
        </EmptyState>
      ) : (
        <AgentsTable agents={shown} now={now} caption="Agents and what each is doing now" />
      )}
    </Panel>
  );
}

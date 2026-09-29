"use client";

import { useState } from "react";
import { Bot, RefreshCw, SearchX } from "lucide-react";
import type { AgentStatus, AgentSummary } from "../types";
import { AgentsTable } from "../components/AgentsTable";
import { Button, IconButton } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { FilterChips, SearchField, type Chip } from "../components/Fields";
import { PageHeader, Panel } from "../components/Panel";
import { AGENT_STATUS, AGENT_STATUS_ORDER, countByStatus, isOnline, matchesAgent } from "../lib/status";

type Filter = AgentStatus | "all";

export function AgentsPage({ agents, now }: { agents: readonly AgentSummary[]; now: Date }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const counts = countByStatus(agents);
  const online = agents.filter((a) => isOnline(a.status)).length;

  // Every status that has agents, plus the chosen one even when it has none left.
  const chips: Chip<Filter>[] = [
    { value: "all", label: "All", count: agents.length },
    ...AGENT_STATUS_ORDER.filter((s) => counts[s] > 0 || s === filter).map((s) => ({ value: s, label: AGENT_STATUS[s].label, count: counts[s] })),
  ];
  const shown = agents.filter((a) => (filter === "all" || a.status === filter) && matchesAgent(a, search));

  return (
    <div className="ak-page">
      <PageHeader
        title="Your agents"
        subtitle="Every agent on the hub, what it is doing and when it last checked in. Open one to see its jobs on the board."
      />
      {agents.length === 0 ? (
        <EmptyState icon={Bot} title="No agents yet" text="Agents appear here once an operator registers them on the hub." />
      ) : (
        <Panel
          title="All agents"
          subtitle={`${agents.length} registered · ${online} online`}
          flush
          actions={
            <>
              <SearchField label="Search agents by id or role" value={search} onChange={setSearch} />
              <IconButton label="Refresh agents" icon={RefreshCw} />
            </>
          }
        >
          <div className="ak-panel__band">
            <FilterChips label="Show agents by status" chips={chips} selected={filter} onSelect={setFilter} />
          </div>
          <p className="sr-only" aria-live="polite">
            {shown.length === 1 ? "1 agent shown" : `${shown.length} agents shown`}
          </p>
          {shown.length === 0 ? (
            <EmptyState
              bare
              icon={SearchX}
              title="No agents to show"
              text={search ? "No agent matches that search." : filter === "all" ? undefined : `No agent has the status “${AGENT_STATUS[filter].label}” right now.`}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Show all agents
              </Button>
            </EmptyState>
          ) : (
            <AgentsTable agents={shown} now={now} caption="Agents and what each is doing now. Choose one to open its board." />
          )}
        </Panel>
      )}
    </div>
  );
}

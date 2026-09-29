import type { Metadata } from "next";
import { NOW, getAgents } from "@/agent-kernel/lib/data";
import { AgentsPage } from "@/agent-kernel/pages/AgentsPage";

export const metadata: Metadata = { title: "Agents" };

export default function Page() {
  return <AgentsPage agents={getAgents()} now={NOW} />;
}

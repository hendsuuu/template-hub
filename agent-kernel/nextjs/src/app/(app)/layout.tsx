import { AppShell } from "@/agent-kernel/layout/AppShell";
import { NOW, getHub, getJobCounts } from "@/agent-kernel/lib/data";

export default function AgentKernelAppLayout({ children }: { children: React.ReactNode }) {
  const hub = getHub();
  return (
    <AppShell user={hub.user} tenantName={hub.tenant.name} agents={hub.agents} updatedAt={NOW} waiting={getJobCounts().waiting}>
      {children}
    </AppShell>
  );
}

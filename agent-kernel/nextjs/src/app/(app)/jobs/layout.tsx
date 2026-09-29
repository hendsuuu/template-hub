import { JobsPage } from "@/agent-kernel/pages/JobsPage";

/** The list stays mounted (with its filters) while a job's drawer opens and closes over it. */
export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <JobsPage>{children}</JobsPage>;
}

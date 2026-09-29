import { SchedulesPage } from "@/agent-kernel/pages/SchedulesPage";

/** The schedules stay mounted while a last job's drawer opens and closes over them. */
export default function SchedulesLayout({ children }: { children: React.ReactNode }) {
  return <SchedulesPage>{children}</SchedulesPage>;
}

import type { Metadata } from "next";
import { getJobDetail, getSchedules } from "@/agent-kernel/lib/data";
import { JobDrawer } from "@/agent-kernel/pages/JobDrawer";
import { paths } from "@/agent-kernel/paths";

export const metadata: Metadata = { title: "Schedules" };

export function generateStaticParams() {
  return getSchedules().hub.flatMap((s) => (s.lastJob ? [{ jobId: s.lastJob.jobId }] : []));
}

export default async function Page({ params }: PageProps<"/schedules/[jobId]">) {
  const id = decodeURIComponent((await params).jobId);
  return <JobDrawer jobId={id} detail={await getJobDetail(id)} closeHref={paths.schedules()} />;
}

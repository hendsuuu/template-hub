import type { Metadata } from "next";
import { getJobDetail } from "@/agent-kernel/lib/data";
import { JobDrawer } from "@/agent-kernel/pages/JobDrawer";
import { paths } from "@/agent-kernel/paths";

export const metadata: Metadata = { title: "Board" };

export default async function Page({ params, searchParams }: PageProps<"/board/[jobId]">) {
  const { jobId } = await params;
  const { agent } = await searchParams;
  const id = decodeURIComponent(jobId);
  return <JobDrawer jobId={id} detail={await getJobDetail(id)} closeHref={paths.board(typeof agent === "string" ? agent : null)} />;
}

import type { Metadata } from "next";
import { getJobDetail, getJobIds } from "@/agent-kernel/lib/data";
import { JobDrawer } from "@/agent-kernel/pages/JobDrawer";
import { paths } from "@/agent-kernel/paths";

export const metadata: Metadata = { title: "Jobs" };

export function generateStaticParams() {
  return getJobIds().map((jobId) => ({ jobId }));
}

export default async function Page({ params }: PageProps<"/jobs/[jobId]">) {
  const id = decodeURIComponent((await params).jobId);
  return <JobDrawer jobId={id} detail={await getJobDetail(id)} closeHref={paths.jobs()} />;
}

import type { Metadata } from "next";
import { OverviewPage } from "@/agent-kernel/pages/OverviewPage";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return <OverviewPage />;
}

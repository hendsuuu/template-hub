import type { Metadata } from "next";
import { ComponentsPage } from "@/agent-kernel/pages/ComponentsPage";

export const metadata: Metadata = { title: "Components" };

export default function Page() {
  return <ComponentsPage />;
}

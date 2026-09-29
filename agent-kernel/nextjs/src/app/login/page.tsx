import type { Metadata } from "next";
import { LoginPage } from "@/agent-kernel/pages/LoginPage";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <LoginPage />;
}

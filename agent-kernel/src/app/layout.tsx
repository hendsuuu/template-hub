import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SIDEBAR_SCRIPT } from "@/agent-kernel/layout/sidebarState";
import { THEME_SCRIPT } from "@/agent-kernel/layout/themeState";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Agent hub", template: "%s · Agent hub" },
  description: "Operations dashboard: agents, jobs, a kanban board and schedules.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${poppins.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme and restores a collapsed sidebar before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT + SIDEBAR_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <div className="ak-root">{children}</div>
      </body>
    </html>
  );
}

import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useParams, useSearchParams } from "react-router";
import type { JobDetail } from "./agent-kernel/types";
import { AppShell } from "./agent-kernel/layout/AppShell";
import { pageFor } from "./agent-kernel/layout/nav";
import { NOW, getAgents, getHub, getJobCounts, getJobDetail } from "./agent-kernel/lib/data";
import { paths } from "./agent-kernel/paths";
import { JobDrawer } from "./agent-kernel/pages/JobDrawer";

/** The signed-in shell around every page but the sign-in screen. */
export function Shell() {
  const hub = getHub();
  return (
    <AppShell user={hub.user} tenantName={hub.tenant.name} agents={getAgents()} updatedAt={NOW} waiting={getJobCounts().waiting}>
      <Outlet />
    </AppShell>
  );
}

/** A job's drawer over the page that opened it: /jobs/:jobId, /board/:jobId, /schedules/:jobId. */
export function DrawerRoute({ section }: { section: "jobs" | "board" | "schedules" }) {
  const { jobId = "" } = useParams();
  const [search] = useSearchParams();
  const [detail, setDetail] = useState<{ jobId: string; value: JobDetail | null } | null>(null);

  useEffect(() => {
    let current = true;
    void getJobDetail(jobId).then((value) => current && setDetail({ jobId, value }));
    return () => {
      current = false;
    };
  }, [jobId]);

  if (detail?.jobId !== jobId) return null;
  const closeHref = section === "board" ? paths.board(search.get("agent")) : section === "jobs" ? paths.jobs() : paths.schedules();
  return <JobDrawer key={jobId} jobId={jobId} detail={detail.value} closeHref={closeHref} />;
}

/**
 * What a server-rendered app gets for free: the tab title follows the page,
 * a new page starts at the top (a drawer opening over one does not), and
 * /board#waiting scrolls to its column.
 */
export function PageEffects() {
  const { pathname, hash } = useLocation();
  const section = pathname.split("/")[1] ?? "";
  const lastSection = useRef(section);

  useEffect(() => {
    document.title = pathname === paths.login() ? "Sign in · Agent hub" : `${pageFor(pathname).label} · Agent hub`;
  }, [pathname]);

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "nearest", inline: "nearest" });
    else if (section !== lastSection.current) window.scrollTo(0, 0);
    lastSection.current = section;
  }, [section, hash]);

  return null;
}

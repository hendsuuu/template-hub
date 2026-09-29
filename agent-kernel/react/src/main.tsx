import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./index.css";
import { NOW, getAgents } from "./agent-kernel/lib/data";
import { AgentsPage } from "./agent-kernel/pages/AgentsPage";
import { BoardFromUrl } from "./agent-kernel/pages/BoardPage";
import { ComponentsPage } from "./agent-kernel/pages/ComponentsPage";
import { JobsPage } from "./agent-kernel/pages/JobsPage";
import { LoginPage } from "./agent-kernel/pages/LoginPage";
import { NotFoundPage } from "./agent-kernel/pages/NotFoundPage";
import { OverviewPage } from "./agent-kernel/pages/OverviewPage";
import { SchedulesPage } from "./agent-kernel/pages/SchedulesPage";
import { DrawerRoute, PageEffects, Shell } from "./routes";

const root = document.getElementById("root");
if (!root) throw new Error("index.html needs a #root element");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <PageEffects />
      <div className="ak-root">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Shell />}>
            <Route index element={<OverviewPage />} />
            <Route path="agents" element={<AgentsPage agents={getAgents()} now={NOW} />} />
            <Route
              path="board"
              element={
                <BoardFromUrl>
                  <Outlet />
                </BoardFromUrl>
              }
            >
              <Route path=":jobId" element={<DrawerRoute section="board" />} />
            </Route>
            <Route
              path="jobs"
              element={
                <JobsPage>
                  <Outlet />
                </JobsPage>
              }
            >
              <Route path=":jobId" element={<DrawerRoute section="jobs" />} />
            </Route>
            <Route
              path="schedules"
              element={
                <SchedulesPage>
                  <Outlet />
                </SchedulesPage>
              }
            >
              <Route path=":jobId" element={<DrawerRoute section="schedules" />} />
            </Route>
            <Route path="components" element={<ComponentsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>,
);

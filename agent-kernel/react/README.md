# Agent hub: React starter

The Agent hub dashboard as a standalone single-page app: React 19, React Router, Vite, TypeScript and Tailwind CSS v4. Every page of the template is here, with mock data, ready to connect to your own API.

## Run it

```bash
npm install
npm run dev
```

Open the address Vite prints (http://localhost:5173 by default). `npm run build` writes a static build to `dist/`; serve it with a fallback to `index.html` so deep links such as `/jobs/job_123` work.

## Pages

| Address | Page |
| --- | --- |
| `/` | Overview |
| `/agents` | Agents |
| `/board`, `/board/:jobId` | Kanban board, with a job's drawer over it (`?agent=` filters the board) |
| `/jobs`, `/jobs/:jobId` | Jobs, with the job drawer |
| `/schedules`, `/schedules/:jobId` | Schedules, with the last job's drawer |
| `/components` | Every component, with its classes |
| `/login` | Sign in |

## Layout

```
index.html                restores a collapsed sidebar before the first paint
src/main.tsx              the routes
src/routes.tsx            the shell, the drawer route, page titles and scroll
src/index.css             Tailwind, the design tokens and the template's classes
src/agent-kernel/         the template: components, layout, pages, lib, data
  brand.css               design tokens (Tailwind v4 @theme)
  agent-kernel.css        every component class (ak-*)
  router.tsx              the router adapter (React Router): components import Link and the hooks from here
  paths.ts                every address
  lib/data.ts             the data functions: replace them with your API
```

The components are the same files as in the Next.js starter; only `router.tsx` differs. Their `"use client"` lines are ignored by Vite.

## Keeping it in step

`src/agent-kernel/` (all but `router.tsx`) is generated from the template's source, which the Next.js starter shares, so change it there rather than here: see [Maintaining](../../README.md#maintaining). Once you copy the starter out, it is yours to change.

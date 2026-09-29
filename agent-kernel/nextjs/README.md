# Agent hub: Next.js starter

The Agent hub dashboard as a standalone Next.js 16 app (App Router, React 19, TypeScript, Tailwind CSS v4). Every page of the template is here, with mock data, ready to connect to your own API.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` makes a production build; `npm run typecheck` and `npm run lint` check the code.

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
src/app/                  routes; the board, jobs and schedules layouts keep the list mounted while a drawer opens
src/app/globals.css       Tailwind, the design tokens and the template's classes
src/agent-kernel/         the template: components, layout, pages, lib, data
  brand.css               design tokens (Tailwind v4 @theme)
  agent-kernel.css        every component class (ak-*)
  router.tsx              the router adapter: components import Link and the hooks from here
  paths.ts                every address
  lib/data.ts             the data functions: replace them with your API
```

## Using a component

```tsx
import { Panel } from "@/agent-kernel/components/Panel";
import { Pill } from "@/agent-kernel/components/Pill";

export function Example() {
  return (
    <Panel title="Queue" subtitle="Jobs waiting for an agent">
      <Pill tone="blue">3 queued</Pill>
    </Panel>
  );
}
```

The classes work on their own too: `<span class="ak-pill ak-pill--blue">3 queued</span>`.

## Keeping it in step

`src/agent-kernel/` and the routes in `src/app/` are generated from the template's source, which the React starter shares, so change them there rather than here: see [Maintaining](../../README.md#maintaining). Once you copy the starter out, it is yours to change.

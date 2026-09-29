# Agent hub: Astro starter

The Agent hub style and components for Astro (static output, Tailwind CSS v4). It has the app shell, every core component as an `.astro` file and three pages; the behaviour that needs script (sorting, filtering, the sidebar collapse, dialogs) comes from one small file, `public/ui.js`, wired with data attributes. No framework JavaScript is shipped.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:4321. `npm run build` writes the static site to `dist/`; `npm run preview` serves that build.

## Pages

| Address | Page |
| --- | --- |
| `/` | Overview: stat cards, the activity chart, work by agent, the agents table (search, status filter, sorting) and recent jobs |
| `/components` | Every component, with its classes |
| `/login` | Sign in |
| anything else | Not found, inside the shell |

The navigation also links to Agents, Board, Jobs and Schedules, and the tables link to agents' boards and to jobs. Those pages are not part of this starter, so the links lead to the not-found page until you build them; the Next.js and React starters have all of them to copy from.

## Layout

```
public/ui.js                   behaviour by data attributes (see the comment at its top)
src/layouts/BaseLayout.astro   the document: fonts, stylesheet, the sidebar restore script, ui.js
src/layouts/AppLayout.astro    the signed-in shell: sidebar, popover menu on phones, top bar
src/components/ak/             the components: Button, Pill, StatusBadge, Panel, StatCard, ActivityChart, AgentsTable, …
src/pages/                     index, components, login, 404
src/styles/global.css          Tailwind, the design tokens and the template's classes
src/styles/brand.css           design tokens (Tailwind v4 @theme)
src/styles/agent-kernel.css    every component class (ak-*)
src/data/hub.json              the mock data snapshot
src/lib/                       formatting, statuses, the chart scale, data access (lib/data.ts: replace it with your API)
```

## Using a component

```astro
---
import Panel from "../components/ak/Panel.astro";
import Pill from "../components/ak/Pill.astro";
---

<Panel title="Queue" subtitle="Jobs waiting for an agent">
  <Pill tone="blue">3 queued</Pill>
</Panel>
```

Tables sort and filter without writing script: give the `<table>` an id and `data-ak-sortable`, point a search box at it with `data-ak-search="#id"` or a select with `data-ak-filter="status" data-ak-filter-target="#id"`, and give each row `data-search` and `data-status`. `AgentsTable.astro` and the overview page show the whole pattern.

## Keeping it in step

The stylesheets, `public/ui.js`, the data and most of `src/lib/` are generated from the template's source, which every Agent hub starter shares, so change them there rather than here: see [Maintaining](../../README.md#maintaining). Once you copy the starter out, it is yours to change.

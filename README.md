# template-hub

Dashboard and landing page templates built with Tailwind CSS v4, each ready to use as a boilerplate for **Next.js**, **React (Vite)**, **Astro** or **Laravel**. All the starters of a template share one set of component classes, so it looks and behaves the same whichever framework you pick.

## Templates

| Template | Kind | Starters |
| --- | --- | --- |
| **Agent hub** | Dashboard: agents, jobs, a kanban board, schedules | [Next.js](agent-kernel/nextjs) · [React](agent-kernel/react) · [Astro](agent-kernel/astro) · [Laravel](agent-kernel/laravel) |

### Agent hub

An operations dashboard for AI agents: stat cards with corner brackets, an activity chart, sortable tables that turn into cards on narrow screens, a kanban board, job drawers, schedules with switches, and a collapsible sidebar with a popover menu on phones. Every starter has a `/components` page that shows each component with its classes.

| Starter | What you get | Run it |
| --- | --- | --- |
| [Next.js](agent-kernel/nextjs) | Every page, App Router, nested routes for the job drawers | `npm install`, `npm run dev` |
| [React (Vite)](agent-kernel/react) | Every page, React Router | `npm install`, `npm run dev` |
| [Astro](agent-kernel/astro) | The shell, 30 `.astro` components, and the overview, components and sign-in pages | `npm install`, `npm run dev` |
| [Laravel](agent-kernel/laravel) | The Blade layout, 30 Blade components, and the overview, components and sign-in pages | `composer install`, `npm install`, `npm run build`, `php artisan serve` |

## Starting a project

Copy a starter into a new folder:

```bash
npx degit hendsuuu/template-hub/agent-kernel/nextjs my-dashboard
```

Swap `nextjs` for `react`, `astro` or `laravel` to start from another framework. Each starter is a standalone project with its own README and commands.

## How the styles work

- **Design tokens** (`brand.css`): colours, type, radii and shadows as a Tailwind v4 `@theme`. Tailwind's default palette is switched off, so only the tokens exist as utilities (`bg-app`, `bg-panel`, `text-soft`, `text-quiet`, `border-line`, `text-orange`, …). Surfaces are dark navy, orange is the one accent, status colours carry meaning only (green done, blue in progress, orange needs a person, red failed), and Poppins is the typeface.
- **Component classes** (`agent-kernel.css`): every component as an `ak-*` class inside `@layer components`, so any Tailwind utility still overrides it. The four starters use the same file.
- **Native interactivity** wherever it can be: the Jobs / Spend switch is a pair of radios read with `:has()`, chart tooltips are `:hover` and `:focus`, the phone menu is a popover, and tables become cards with container queries. Sorting, filtering, the sidebar collapse and dialogs use React in the Next.js and React starters, and one small `ui.js` in Astro and Laravel.

| | Next.js and React | Astro | Laravel |
| --- | --- | --- | --- |
| Design tokens | `src/agent-kernel/brand.css` | `src/styles/brand.css` | `resources/css/brand.css` |
| Component classes | `src/agent-kernel/agent-kernel.css` | `src/styles/agent-kernel.css` | `resources/css/agent-kernel.css` |
| Behaviour | React components in `src/agent-kernel/` | `public/ui.js` | `public/ui.js` |
| Mock data | `src/agent-kernel/data/` | `src/data/hub.json` | `resources/data/hub.json` |

## Maintaining

Each template is built and previewed in a separate workshop, kept outside this repository. The files the starters share (the design tokens, the stylesheet, `ui.js`, the data and the React components) are generated there by `npm run sync:starters`, and `npm run check:starters` fails when a starter has drifted. So change those files in the workshop, sync, then commit here. Everything else in a starter belongs to that starter.

## Credits

Icons are [Lucide](https://lucide.dev) (ISC).

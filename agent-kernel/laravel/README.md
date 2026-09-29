# Agent hub: Laravel starter

The Agent hub style and components for Laravel 13: Blade components, Vite and Tailwind CSS v4. It has the app shell, every core component as an anonymous Blade component and three pages; the behaviour that needs script (sorting, filtering, the sidebar collapse, dialogs) comes from one small file, `public/ui.js`, wired with data attributes. It runs with no database: sessions and the cache use files.

## Requirements

PHP 8.3 or later, Composer, and Node.js 22.12 or later.

## Run it

```bash
composer install
```

```bash
cp .env.example .env
```

```bash
php artisan key:generate
```

```bash
npm install
```

```bash
npm run build
```

```bash
php artisan serve
```

Open http://localhost:8000. While you work on the front end, run `npm run dev` alongside `php artisan serve` so styles reload as you save.

### Without PHP on your machine

The official Docker images do the same job:

```bash
docker run --rm -v "$PWD":/app -w /app composer:2 install
```

```bash
docker run --rm -v "$PWD":/app -w /app php:8.4-cli php artisan key:generate
```

```bash
docker run --rm -p 8000:8000 -v "$PWD":/app -w /app php:8.4-cli php artisan serve --host=0.0.0.0 --port=8000
```

## Pages

| Address | View |
| --- | --- |
| `/` | `agent-hub/overview`: stat cards, the activity chart, work by agent, the agents table (search, status filter, sorting) and recent jobs |
| `/components` | `agent-hub/components`: every component, with its classes |
| `/login` | `agent-hub/login` |
| anything else | `errors/404`, inside the shell |

The navigation also links to Agents, Board, Jobs and Schedules, and the tables link to agents' boards and to jobs. Those pages are not part of this starter, so the links lead to the not-found page until you build them; the Next.js starter has all of them to copy from.

## Layout

```
app/Support/AgentHub/                      data access (Hub), formatting, statuses, the chart scale, shares, icons, navigation
resources/views/components/layouts/        base (the document) and agent-hub (the signed-in shell)
resources/views/components/ak/             the components: button, pill, status-badge, panel, stat-card, activity-chart, agents-table, …
resources/views/agent-hub/                 the pages
resources/css/app.css                      Tailwind, the design tokens and the template's classes
resources/css/brand.css                    design tokens (Tailwind v4 @theme)
resources/css/agent-kernel.css             every component class (ak-*)
resources/data/hub.json                    the mock data snapshot
resources/svg/lucide/                      the Lucide icons in use (ISC licence)
public/ui.js                               behaviour by data attributes (see the comment at its top)
```

## Using a component

```blade
<x-ak.panel title="Queue" subtitle="Jobs waiting for an agent">
    <x-slot:actions>
        <x-ak.button variant="secondary" size="sm" href="/jobs">All jobs</x-ak.button>
    </x-slot:actions>
    <x-ak.pill tone="blue">3 queued</x-ak.pill>
</x-ak.panel>
```

Icons are `<x-ak.icon name="bell" />`; to add one, copy its file from the [lucide-static](https://www.npmjs.com/package/lucide-static) package into `resources/svg/lucide/`.

Tables sort and filter without writing script: give the `<table>` an id and `data-ak-sortable`, point `<x-ak.search-field target="#id" />` or `<x-ak.select-field filter="status" target="#id">` at it, and give each row `data-search` and `data-status`. `agents-table.blade.php` and the overview show the whole pattern.

To connect real data, replace the methods in `app/Support/AgentHub/Hub.php` with calls to your API; the shapes match the hub's dashboard API.

## Keeping it in step

The stylesheets, `public/ui.js` and the data are generated from the template's source, which every Agent hub starter shares, so change them there rather than here: see [Maintaining](../../README.md#maintaining). Once you copy the starter out, it is yours to change.

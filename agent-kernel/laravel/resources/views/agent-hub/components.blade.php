{{-- Every Blade component of the template in one place, with the classes it is built from. --}}
@use('App\Support\AgentHub\Hub')
@use('App\Support\AgentHub\Status')
@php
    $bars = [4, 7, 5, 9, 6, 3, 8];
    $tone = fn (string $t) => array_map(fn ($value) => ['value' => $value, 'tone' => $t], $bars);
    $row = 'flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-b-0';
    $label = 'ak-small w-40 shrink-0';
@endphp

<x-layouts.agent-hub title="Components">
    <div class="ak-page">
        <x-ak.page-header title="Components" subtitle="Every building block of the template, with the classes it uses. The same classes work in the React, Next.js and Astro starters.">
            <x-slot:aside><x-ak.period-chip>ak-* classes</x-ak.period-chip></x-slot:aside>
        </x-ak.page-header>

        <x-ak.panel title="Buttons" id="buttons">
            <x-slot:lead><code class="ak-cron">ak-btn · ak-btn--primary | --secondary | --quiet | --danger · ak-btn--sm · ak-icon-btn</code></x-slot:lead>
            <div class="{{ $row }}">
                <p class="{{ $label }}">Variants</p>
                <div class="flex flex-wrap items-center gap-2">
                    <x-ak.button><x-ak.icon name="plus" :size="15" />New job</x-ak.button>
                    <x-ak.button variant="secondary"><x-ak.icon name="download" :size="15" />Export</x-ak.button>
                    <x-ak.button variant="quiet">Clear</x-ak.button>
                    <x-ak.button variant="danger"><x-ak.icon name="ban" :size="15" />Cancel job</x-ak.button>
                </div>
            </div>
            <div class="{{ $row }}">
                <p class="{{ $label }}">Small</p>
                <div class="flex flex-wrap items-center gap-2">
                    <x-ak.button size="sm">Run now</x-ak.button>
                    <x-ak.button variant="secondary" size="sm"><x-ak.icon name="play" :size="13" />Run now</x-ak.button>
                    <x-ak.button variant="quiet" size="sm">Show every agent</x-ak.button>
                    <x-ak.button size="sm" disabled>Disabled</x-ak.button>
                </div>
            </div>
            <div class="{{ $row }}">
                <p class="{{ $label }}">Icon buttons</p>
                <div class="flex flex-wrap items-center gap-2">
                    <x-ak.icon-button label="Refresh" icon="refresh-cw" />
                    <x-ak.icon-button label="Settings" icon="settings" />
                    <x-ak.icon-button label="Disabled" icon="bot" disabled />
                </div>
            </div>
        </x-ak.panel>

        <div class="grid grid-cols-2 gap-3 @max-[880px]:grid-cols-1">
            <x-ak.panel title="Pills and changes" id="pills">
                <x-slot:lead><code class="ak-cron">ak-pill · ak-pill--neutral | --blue | --green | --orange | --red | --grey</code></x-slot:lead>
                <div class="{{ $row }}">
                    <p class="{{ $label }}">Tones</p>
                    <div class="flex flex-wrap items-center gap-2">
                        <x-ak.pill>3 not online</x-ak.pill><x-ak.pill tone="blue">2 queued</x-ak.pill><x-ak.pill tone="green">All clear</x-ak.pill><x-ak.pill tone="orange">Needs you</x-ak.pill><x-ak.pill tone="red">error</x-ak.pill><x-ak.pill tone="grey">Paused</x-ak.pill>
                    </div>
                </div>
                <div class="{{ $row }}">
                    <p class="{{ $label }}">Change</p>
                    <div class="flex flex-wrap items-center gap-2">
                        <x-ak.delta-pill :change="14" against="the 7 days before" /><x-ak.delta-pill :change="-6" against="the 7 days before" /><x-ak.delta-pill :change="0" against="the 7 days before" />
                    </div>
                </div>
                <div class="{{ $row }}">
                    <p class="{{ $label }}">Dots</p>
                    <div class="flex flex-wrap items-center gap-2">
                        @foreach (array_keys(Status::AGENT) as $status)
                            <x-ak.status-dot :status="$status" />
                        @endforeach
                    </div>
                </div>
            </x-ak.panel>
            <x-ak.panel title="Statuses" id="statuses">
                <x-slot:lead><code class="ak-cron">ak-status · ak-dot--&lt;status&gt; · ak-tag · ak-tag--&lt;tone&gt;</code></x-slot:lead>
                <div class="{{ $row }}">
                    <p class="{{ $label }}">Agents</p>
                    <div class="flex flex-wrap items-center gap-2">
                        @foreach (array_keys(Status::AGENT) as $status)
                            <x-ak.status-badge :status="$status" />
                        @endforeach
                    </div>
                </div>
                <div class="{{ $row }}">
                    <p class="{{ $label }}">Jobs</p>
                    <div class="flex flex-wrap items-center gap-2">
                        @foreach (array_keys(Status::JOB) as $status)
                            <x-ak.job-status-tag :status="$status" />
                        @endforeach
                    </div>
                </div>
            </x-ak.panel>
        </div>

        <x-ak.panel title="Fields" id="fields">
            <x-slot:lead><code class="ak-cron">ak-search · ak-select · ak-segmented · ak-switch · ak-chips · ak-chip</code></x-slot:lead>
            <div class="{{ $row }}">
                <p class="{{ $label }}">Search and select</p>
                <div class="flex flex-wrap items-center gap-2">
                    <x-ak.search-field label="Search the sample" />
                    <x-ak.select-field label="Status"><option value="">Any status</option><option value="working">Working</option><option value="waiting">Waiting for you</option></x-ak.select-field>
                </div>
            </div>
            <div class="{{ $row }}">
                <p class="{{ $label }}">Segmented</p>
                <x-ak.segmented label="Show" name="ak-demo-mode" default="jobs" :options="['jobs' => 'Jobs', 'spend' => 'Spend']" />
            </div>
            <div class="{{ $row }}">
                <p class="{{ $label }}">Switch</p>
                <x-ak.switch :checked="true" label="Run on its schedule" />
            </div>
            <div class="{{ $row }}">
                <p class="{{ $label }}">Filter chips</p>
                <x-ak.filter-chips label="Show agents by status" selected="all" filter="status" target="#sample-agents" :chips="[
                    ['value' => 'all', 'label' => 'All', 'count' => 4],
                    ['value' => 'working', 'label' => 'Working', 'count' => 2],
                    ['value' => 'picking_up', 'label' => 'Picking up', 'count' => 1],
                    ['value' => 'waiting', 'label' => 'Waiting for you', 'count' => 1],
                ]" />
            </div>
        </x-ak.panel>

        <section aria-label="Stat cards">
            <dl class="grid grid-cols-4 gap-3 @max-[880px]:grid-cols-2 @max-[520px]:grid-cols-1">
                <x-ak.stat-card icon="bot" label="Agents online" :value="5" suffix="of 8">
                    <x-slot:chart><x-ak.mini-bars :bars="array_map(fn ($v, $i) => ['value' => $v, 'tone' => $i < 5 ? 'blue' : 'grey'], $bars, array_keys($bars))" :history="false" /></x-slot:chart>
                    <x-slot:meta><x-ak.pill>3 not online</x-ak.pill></x-slot:meta>
                </x-ak.stat-card>
                <x-ak.stat-card icon="hand" label="Waiting for you" :value="3" :attention="true">
                    <x-slot:chart><x-ak.mini-bars :bars="$tone('orange')" /></x-slot:chart>
                    <x-slot:meta><x-ak.pill tone="orange">Needs you</x-ak.pill></x-slot:meta>
                </x-ak.stat-card>
                <x-ak.stat-card icon="wallet" label="Spend (7 days)" value="$6.78">
                    <x-slot:corner><x-ak.delta-pill :change="14" against="the 7 days before" /></x-slot:corner>
                    <x-slot:chart><x-ak.mini-bars :bars="$tone('blue')" /></x-slot:chart>
                    <x-slot:meta><span>ak-stat · ak-stat--attention · ak-minibars</span></x-slot:meta>
                </x-ak.stat-card>
                <x-ak.stat-card icon="bot" label="Empty" :value="0">
                    <x-slot:chart><x-ak.mini-bars :bars="array_map(fn () => ['value' => 0, 'tone' => 'green'], $bars)" /></x-slot:chart>
                    <x-slot:meta><x-ak.pill tone="green">All clear</x-ak.pill></x-slot:meta>
                </x-ak.stat-card>
            </dl>
        </section>

        <x-ak.panel title="Activity chart" class="ak-activity" id="chart">
            <x-slot:lead><code class="ak-cron">ak-activity · ak-chart · ak-chart__day · ak-chart__tooltip</code></x-slot:lead>
            <x-slot:actions><x-ak.segmented label="Show" name="ak-chart-mode" default="jobs" :options="['jobs' => 'Jobs', 'spend' => 'Spend']" /></x-slot:actions>
            <x-ak.activity-chart :days="Hub::activity()" mode="jobs" />
            <x-ak.activity-chart :days="Hub::activity()" mode="spend" />
        </x-ak.panel>

        <x-ak.panel title="Data table" :flush="true" id="table">
            <x-slot:lead><code class="ak-cron">ak-table-wrap · ak-table-wrap--cards-sm | md | lg · ak-table · ak-sort · data-ak-sortable</code></x-slot:lead>
            <x-ak.agents-table id="sample-agents" :agents="array_slice(Hub::agents(), 0, 4)" :now="Hub::now()" caption="A sample of agents" />
            <x-ak.empty-state :bare="true" icon="search-x" title="No agents match" text="Try another status." empty-for="#sample-agents" />
        </x-ak.panel>

        <x-ak.panel title="Feedback" id="feedback">
            <x-slot:lead><code class="ak-cron">ak-empty · ak-banner · ak-dialog</code></x-slot:lead>
            <div class="flex flex-col gap-4">
                <x-ak.empty-state icon="search-x" title="No agents match" text="Try another status or search.">
                    <x-ak.button variant="secondary" size="sm">Show all agents</x-ak.button>
                </x-ak.empty-state>
                <x-ak.banner>The hub did not answer. Retrying in 10 seconds.<x-slot:action><x-ak.button variant="secondary" size="sm">Try again</x-ak.button></x-slot:action></x-ak.banner>
                <div class="flex flex-wrap items-center gap-3">
                    <x-ak.button variant="secondary" data-ak-dialog-open="#confirm-cancel">Open a confirmation</x-ak.button>
                    <p class="ak-done" id="confirm-notice" aria-live="polite"></p>
                </div>
            </div>
            <dialog id="confirm-cancel" class="ak-dialog" aria-labelledby="confirm-cancel-title">
                <div class="ak-dialog__body">
                    <h2 id="confirm-cancel-title" class="ak-dialog__title">Cancel this job?</h2>
                    <p class="ak-dialog__text">The agent stops at its next heartbeat.</p>
                    <div class="ak-dialog__actions">
                        <x-ak.button variant="secondary" data-ak-dialog-close>Go back</x-ak.button>
                        <x-ak.button variant="danger" data-ak-dialog-close data-ak-notice="The job was cancelled." data-ak-notice-target="#confirm-notice">Cancel job</x-ak.button>
                    </div>
                </div>
            </dialog>
        </x-ak.panel>
    </div>
</x-layouts.agent-hub>

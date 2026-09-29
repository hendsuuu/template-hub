@use('App\Support\AgentHub\Format')
@use('App\Support\AgentHub\Hub')
@use('App\Support\AgentHub\Status')
@php
    $agents = Hub::agents();
    $activity = Hub::activity();
    $spend = Hub::spend();
    $jobs = Hub::jobCounts();
    $now = Hub::now();
    $name = Format::firstName(Hub::user()['name']);
    $online = count(array_filter($agents, fn ($a) => Status::isOnline($a['status'])));
    $working = count(array_filter($agents, fn ($a) => $a['status'] === 'working'));
    $lastWeek = array_slice($activity, -7);
    $weekBefore = array_slice($activity, -14, 7);
    $spendChange = count($weekBefore) === 7
        ? Format::percentChange(array_sum(array_column($lastWeek, 'spentUsd')), array_sum(array_column($weekBefore, 'spentUsd')))
        : null;
    $agentBars = array_map(fn ($a) => [
        'value' => Status::isOnline($a['status']) ? 1 : 0.35,
        'tone' => Status::AGENT[$a['status']]['tone'],
        'title' => $a['agentId'].': '.Status::AGENT[$a['status']]['label'],
    ], array_slice(Status::sortAgents($agents), 0, 10));
    $dayBars = fn (callable $value, string $tone, callable $unit) => array_map(fn ($d) => [
        'value' => $value($d),
        'tone' => $tone,
        'title' => Format::day($d['day']).': '.$unit($d),
    ], $lastWeek);
    $roles = array_column($agents, 'role', 'agentId');
    $counts = Status::countByStatus($agents);
    $completed = array_sum(array_column($activity, 'completed'));
    $failed = array_sum(array_column($activity, 'failed'));
    $needsInput = array_sum(array_column($activity, 'needsInput'));
    $spent = array_sum(array_column($activity, 'spentUsd'));
@endphp

<x-layouts.agent-hub title="Overview">
    <div class="ak-page">
        <x-ak.page-header :title="$name ? 'Welcome back, '.$name : 'Welcome back'" subtitle="What your agents are doing, and what needs you.">
            <x-slot:aside><x-ak.period-chip>Last 14 days</x-ak.period-chip></x-slot:aside>
        </x-ak.page-header>

        <section aria-label="Summary">
            <dl class="grid grid-cols-4 gap-3 @max-[880px]:grid-cols-2 @max-[520px]:grid-cols-1 @max-[520px]:gap-2">
                <x-ak.stat-card icon="bot" label="Agents online" :value="$online" :suffix="'of '.count($agents)">
                    <x-slot:chart><x-ak.mini-bars :bars="$agentBars" :max="1" :history="false" /></x-slot:chart>
                    <x-slot:meta>
                        @if ($online === count($agents))
                            <x-ak.pill tone="green">All online</x-ak.pill><span>seen in the last {{ Hub::onlineSeconds() }} s</span>
                        @else
                            <x-ak.pill>{{ count($agents) - $online }} not online</x-ak.pill><span>{{ count($agents) }} registered</span>
                        @endif
                    </x-slot:meta>
                </x-ak.stat-card>
                <x-ak.stat-card icon="activity" label="Working now" :value="$working">
                    <x-slot:chart><x-ak.mini-bars :bars="$dayBars(fn ($d) => $d['completed'] + $d['failed'], 'green', fn ($d) => ($d['completed'] + $d['failed']).' finished')" /></x-slot:chart>
                    <x-slot:meta><x-ak.pill tone="blue">{{ $jobs['queued'] }} queued</x-ak.pill><span>waiting for pickup</span></x-slot:meta>
                </x-ak.stat-card>
                <x-ak.stat-card icon="hand" label="Waiting for you" :value="$jobs['waiting']" :attention="$jobs['waiting'] > 0">
                    <x-slot:chart><x-ak.mini-bars :bars="$dayBars(fn ($d) => $d['needsInput'], 'orange', fn ($d) => $d['needsInput'].' needed a person')" /></x-slot:chart>
                    <x-slot:meta>
                        @if ($jobs['waiting'] > 0)
                            <x-ak.pill tone="orange">Needs you</x-ak.pill><a href="/board#waiting" class="ak-stat__meta-link">See what is waiting</a>
                        @else
                            <x-ak.pill tone="green">All clear</x-ak.pill><span>nothing is waiting</span>
                        @endif
                    </x-slot:meta>
                </x-ak.stat-card>
                <x-ak.stat-card icon="wallet" label="Spend (7 days)" :value="Format::usd((float) $spend['last7dUsd'])">
                    <x-slot:corner><x-ak.delta-pill :change="$spendChange" against="the 7 days before" /></x-slot:corner>
                    <x-slot:chart><x-ak.mini-bars :bars="$dayBars(fn ($d) => (float) $d['spentUsd'], 'blue', fn ($d) => Format::usd((float) $d['spentUsd']))" /></x-slot:chart>
                    <x-slot:meta><span>Last 24 h: <span class="ak-stat__meta-value">{{ Format::usd((float) $spend['last24hUsd']) }}</span></span></x-slot:meta>
                </x-ak.stat-card>
            </dl>
        </section>

        <div class="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-3 @max-[880px]:grid-cols-1">
            <x-ak.panel title="Activity" class="ak-activity" id="activity">
                <x-slot:lead>
                    <span data-ak-mode="jobs">Jobs finished per day, last 14 days (UTC)</span>
                    <span data-ak-mode="spend">Known model spend per day, last 14 days (UTC)</span>
                </x-slot:lead>
                <x-slot:actions>
                    <x-ak.segmented label="Show" name="ak-activity-mode" default="jobs" :options="['jobs' => 'Jobs', 'spend' => 'Spend']" />
                </x-slot:actions>
                <div class="ak-headline" data-ak-mode="jobs">
                    <p class="ak-big-number">{{ $completed + $failed }} <span class="ak-big-number__unit">finished</span></p>
                    <ul class="ak-legend" aria-label="Key">
                        <li><span class="ak-swatch ak-swatch--green" aria-hidden="true"></span>Completed <span class="ak-legend__value">{{ $completed }}</span></li>
                        <li><span class="ak-swatch ak-swatch--red" aria-hidden="true"></span>Failed <span class="ak-legend__value">{{ $failed }}</span></li>
                        <li><span class="ak-swatch ak-swatch--ring" aria-hidden="true"></span>Needed a person <span class="ak-legend__value">{{ $needsInput }}</span></li>
                    </ul>
                </div>
                <div class="ak-headline" data-ak-mode="spend">
                    <p class="ak-big-number">{{ Format::usd((float) $spent) }}</p>
                    <p class="ak-headline__side">About <span class="ak-legend__value">{{ Format::usd($activity ? $spent / count($activity) : 0.0) }}</span> a day</p>
                </div>
                <x-ak.activity-chart :days="$activity" mode="jobs" />
                <x-ak.activity-chart :days="$activity" mode="spend" />
                <x-ak.activity-table :days="$activity" />
            </x-ak.panel>

            <x-ak.panel title="Work by agent" subtitle="Share of jobs started, last 7 days" :inline="true" id="work-by-agent">
                <x-slot:actions><span class="ak-total">{{ array_sum(array_column(Hub::workByAgent(), 'jobs')) }} jobs</span></x-slot:actions>
                <div class="flex flex-col gap-5">
                    <x-ak.day-histogram :days="$activity" :highlight-last="7" />
                    <x-ak.share-breakdown :items="Hub::workByAgent()" :roles="$roles" />
                </div>
            </x-ak.panel>
        </div>

        <x-ak.panel title="Agents" :subtitle="count($agents).' registered · '.$online.' online'" :flush="true" id="agents-panel">
            <x-slot:actions>
                <x-ak.search-field label="Search agents" target="#agents" />
                <x-ak.select-field label="Show agents by status" filter="status" target="#agents">
                    <option value="">Any status</option>
                    @foreach (Status::AGENT as $status => $info)
                        <option value="{{ $status }}">{{ $info['label'] }} ({{ $counts[$status] }})</option>
                    @endforeach
                </x-ak.select-field>
                <x-ak.icon-button label="Refresh agents" icon="refresh-cw" />
                <x-ak.icon-button label="Open the agents page" icon="arrow-up-right" href="/agents" />
            </x-slot:actions>
            <x-ak.agents-table id="agents" :agents="$agents" :now="$now" caption="Agents and what each is doing now" />
            <x-ak.empty-state :bare="true" icon="search-x" title="No agents match" text="Try another status or search." empty-for="#agents" />
        </x-ak.panel>

        <x-ak.panel title="Recent jobs" subtitle="The latest updates" :flush="true" id="recent-jobs">
            <x-slot:actions>
                <x-ak.button variant="secondary" size="sm" href="/jobs">All jobs <x-ak.icon name="arrow-right" :size="14" /></x-ak.button>
            </x-slot:actions>
            <x-ak.jobs-table id="recent" :jobs="Hub::recentJobs()" :now="$now" caption="Recently updated jobs" :compact="true" />
        </x-ak.panel>
    </div>
</x-layouts.agent-hub>

{{-- The sidebar, as the desktop rail (collapsible to icons; ui.js keeps the choice) or as the phone menu in the popover drawer. --}}
@props(['mode'])
@use('App\Support\AgentHub\Format')
@use('App\Support\AgentHub\Hub')
@use('App\Support\AgentHub\Nav')
@use('App\Support\AgentHub\Status')
@php
    $path = request()->path();
    $current = request()->is('board', 'board/*') ? request()->query('agent') : null;
    $agents = Hub::agents();
    usort($agents, fn ($a, $b) => strcmp($a['agentId'], $b['agentId']));
    $user = Hub::user();
@endphp
<div class="ak-sidebar">
    <div class="ak-sidebar__brand">
        <a href="/" class="ak-sidebar__product">
            {{-- Placeholder mark: put your approved logo here, at the same size. --}}
            <span class="ak-sidebar__mark" aria-hidden="true"><x-ak.icon name="waypoints" /></span>
            Agent hub
        </a>
        @if ($mode === 'drawer')
            <button type="button" class="ak-sidebar__toggle" popovertarget="ak-nav-drawer" popovertargetaction="hide" aria-label="Close menu" title="Close menu"><x-ak.icon name="x" :size="18" /></button>
        @else
            <button type="button" class="ak-sidebar__toggle" data-ak-sidebar-toggle aria-label="Collapse the sidebar" title="Collapse the sidebar" aria-pressed="false">
                <x-ak.icon name="panel-left-close" :size="18" class="ak-sidebar__toggle-close" />
                <x-ak.icon name="panel-left-open" :size="18" class="ak-sidebar__toggle-open" />
            </button>
        @endif
    </div>

    <div class="ak-sidebar__scroll">
        <nav aria-label="Main" class="ak-sidebar__nav">
            <ul>
                @foreach (Nav::ITEMS as $item)
                    <li>
                        <a href="{{ $item['href'] }}" class="ak-navlink" @if (Nav::isActive($item, $path)) aria-current="page" @endif>
                            <x-ak.icon :name="$item['icon']" :size="17" />
                            <span class="ak-navlink__label">{{ $item['label'] }}</span>
                        </a>
                    </li>
                @endforeach
            </ul>
        </nav>

        <details class="ak-sidebar__agents" open>
            <summary class="ak-sidebar__section-toggle">
                <x-ak.icon name="users" :size="17" />
                <span class="ak-navlink__label">Agents</span>
                <x-ak.icon name="chevron-down" :size="15" class="ak-sidebar__chevron" />
            </summary>
            <ul class="ak-sidebar__agent-list">
                @foreach ($agents as $agent)
                    @php($status = Status::AGENT[$agent['status']])
                    <li>
                        <a href="{{ Nav::board($agent['agentId']) }}" class="ak-agentlink" @if ($current === $agent['agentId']) aria-current="page" @endif title="{{ $agent['agentId'] }}: {{ $status['label'] }}">
                            <span class="ak-agentlink__avatar"><x-ak.agent-avatar size="sm" /><x-ak.status-dot :status="$agent['status']" /></span>
                            <span class="ak-navlink__label">{{ $agent['agentId'] }}</span>
                            <span class="sr-only">, {{ $status['label'] }}</span>
                        </a>
                    </li>
                @endforeach
            </ul>
        </details>
    </div>

    <div class="ak-sidebar__account">
        <div class="ak-sidebar__user">
            <span class="ak-avatar" aria-hidden="true">{{ Format::initials($user['name']) }}</span>
            <div class="ak-sidebar__user-text">
                <p class="ak-sidebar__user-name">{{ $user['name'] }}</p>
                <p class="ak-sidebar__user-email">{{ $user['email'] }}</p>
            </div>
            <span @class(['ak-sidebar__role', 'ak-sidebar__role--admin' => $user['role'] === 'admin'])>{{ $user['role'] === 'admin' ? 'Admin' : 'Viewer' }}</span>
        </div>
        <a href="/login" class="ak-sidebar__signout"><x-ak.icon name="log-out" :size="17" /><span class="ak-navlink__label">Sign out</span></a>
        <p class="ak-sidebar__footer">{{ Hub::tenantName() }}</p>
    </div>
</div>

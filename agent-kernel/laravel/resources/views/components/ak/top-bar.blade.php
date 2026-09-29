{{-- Page icon and title on the left; live state, last update, refresh, "Waiting for you" and the user on the right. --}}
@props(['title' => null])
@use('App\Support\AgentHub\Format')
@use('App\Support\AgentHub\Hub')
@use('App\Support\AgentHub\Nav')
@php
    $page = Nav::pageFor(request()->path());
    $user = Hub::user();
    $waiting = Hub::jobCounts()['waiting'];
    $waitingLabel = $waiting === 0 ? 'Waiting for you: nothing' : "Waiting for you: {$waiting} ".($waiting === 1 ? 'job' : 'jobs');
@endphp
<header class="ak-topbar">
    <button type="button" class="ak-topbar__menu" popovertarget="ak-nav-drawer" aria-label="Open menu"><x-ak.icon name="menu" :size="18" /></button>

    <div class="ak-topbar__title-row">
        <x-ak.icon :name="$page['icon']" :size="20" class="ak-topbar__page-icon" />
        <h1 tabindex="-1" class="ak-topbar__title">{{ $title ?? $page['label'] }}</h1>
    </div>

    <div class="ak-topbar__tools">
        <p class="ak-live" title="Live updates are on." role="status">
            <span class="ak-live__dot" aria-hidden="true"></span>
            <span class="ak-live__label" aria-hidden="true">Live</span>
            <span class="sr-only">Live updates are on.</span>
        </p>
        <p class="ak-topbar__updated"><span class="ak-topbar__updated-word">Updated </span><time datetime="{{ Hub::now()->format(DATE_ATOM) }}">{{ Format::clock(Hub::now()) }}</time></p>
        {{-- Wire this to your data refetch. --}}
        <x-ak.icon-button label="Refresh now" icon="refresh-cw" />
        <a href="/board#waiting" @class(['ak-icon-btn', 'ak-topbar__waiting' => $waiting > 0]) aria-label="{{ $waitingLabel }}" title="{{ $waitingLabel }}">
            <x-ak.icon name="bell" />
            @if ($waiting > 0)
                <span class="ak-topbar__badge" aria-hidden="true">{{ $waiting > 99 ? '99+' : $waiting }}</span>
            @endif
        </a>
        <span class="ak-avatar" role="img" aria-label="Signed in as {{ $user['name'] }}" title="{{ $user['name'] }} · {{ $user['email'] }}">{{ Format::initials($user['name']) }}</span>
    </div>
</header>

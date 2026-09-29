{{--
    A titled section: a header row (title, subtitle, controls) over its content.
    Slots: `lead` (a subtitle with markup), `actions`, `before` (before the header,
    such as the radios a panel reads with :has()), and the default slot.
--}}
@props(['title', 'subtitle' => null, 'flush' => false, 'inline' => false, 'id' => null])
@php($titleId = ($id ?? \Illuminate\Support\Str::slug($title)).'-title')
<section @if ($id) id="{{ $id }}" @endif aria-labelledby="{{ $titleId }}" {{ $attributes->class(['ak-panel', 'ak-panel--inline' => $inline]) }}>
    {{ $before ?? '' }}
    <header class="ak-panel__head">
        <div class="ak-panel__heading">
            <h2 id="{{ $titleId }}" class="ak-panel__title">{{ $title }}</h2>
            @if (isset($lead))
                <p class="ak-panel__subtitle">{{ $lead }}</p>
            @elseif ($subtitle)
                <p class="ak-panel__subtitle">{{ $subtitle }}</p>
            @endif
        </div>
        @isset($actions)
            <div class="ak-panel__actions">{{ $actions }}</div>
        @endisset
    </header>
    <div class="{{ $flush ? 'ak-panel__flush' : 'ak-panel__body' }}">{{ $slot }}</div>
</section>

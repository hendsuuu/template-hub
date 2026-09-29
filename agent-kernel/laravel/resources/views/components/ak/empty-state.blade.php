{{-- A calm placeholder where a list has nothing to show. With `empty-for`, ui.js shows it when a filter empties that table. --}}
@props(['icon', 'title', 'text' => null, 'bare' => false, 'emptyFor' => null])
<div @class(['ak-empty', 'ak-empty--bare' => $bare]) @if ($emptyFor) data-ak-empty-for="{{ $emptyFor }}" hidden @endif>
    <span class="ak-empty__icon" aria-hidden="true"><x-ak.icon :name="$icon" :size="18" /></span>
    <p class="ak-empty__title">{{ $title }}</p>
    @if ($text)
        <p class="ak-empty__text">{{ $text }}</p>
    @endif
    {{ $slot }}
</div>

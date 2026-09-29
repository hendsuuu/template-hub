{{-- A change as "▲ 12%", spelled out for assistive tech. Neutral: more is not better or worse. --}}
@props(['change', 'against'])
@if ($change !== null)
    @php
        $words = $change === 0 ? "No change on {$against}" : ($change > 0 ? 'Up' : 'Down').' '.abs($change)."% on {$against}";
    @endphp
    <x-ak.pill :title="$words">
        @if ($change !== 0)
            <x-ak.icon :name="$change < 0 ? 'chevron-down' : 'chevron-up'" :size="12" :stroke-width="2.5" />
        @endif
        <span aria-hidden="true">{{ $change === 0 ? '0%' : abs($change).'%' }}</span>
        <span class="sr-only">{{ $words }}</span>
    </x-ak.pill>
@endif

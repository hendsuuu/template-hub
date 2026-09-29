{{-- A row of toggle buttons; exactly one is pressed. With `filter` and `target`, ui.js filters that table. --}}
@props(['label', 'chips', 'selected' => 'all', 'filter' => null, 'target' => null])
<div role="group" aria-label="{{ $label }}" class="ak-chips" @if ($filter) data-ak-filter="{{ $filter }}" data-ak-filter-target="{{ $target }}" @endif>
    @foreach ($chips as $chip)
        <button type="button" class="ak-chip" aria-pressed="{{ $chip['value'] === $selected ? 'true' : 'false' }}" data-value="{{ $chip['value'] === 'all' ? '' : $chip['value'] }}">
            {{ $chip['label'] }}
            <span class="ak-chip__count">{{ $chip['count'] }}</span>
        </button>
    @endforeach
</div>

{{--
    A native select in the template's control style; put <option>s in the slot.
    With `filter` and `target`, ui.js shows only the rows whose data-<filter>
    equals the chosen value (an empty value shows all).
--}}
@props(['label', 'showLabel' => false, 'filter' => null, 'target' => null])
@php($id = 'select-'.\Illuminate\Support\Str::slug($label))
<div {{ $attributes->class('ak-select-field') }}>
    <label for="{{ $id }}" class="{{ $showLabel ? 'ak-label' : 'sr-only' }}">{{ $label }}</label>
    <select id="{{ $id }}" class="ak-select" @if ($filter) data-ak-filter="{{ $filter }}" data-ak-filter-target="{{ $target }}" @endif>{{ $slot }}</select>
</div>

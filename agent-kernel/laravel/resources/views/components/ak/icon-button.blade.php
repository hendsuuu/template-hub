{{-- A small square button with only an icon; `label` is its only text. --}}
@props(['label', 'icon', 'href' => null])
@if ($href)
    <a href="{{ $href }}" aria-label="{{ $label }}" title="{{ $label }}" {{ $attributes->class('ak-icon-btn') }}><x-ak.icon :name="$icon" /></a>
@else
    <button type="button" aria-label="{{ $label }}" title="{{ $label }}" {{ $attributes->class('ak-icon-btn') }}><x-ak.icon :name="$icon" /></button>
@endif

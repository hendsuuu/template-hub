{{-- A search box with an icon and a clear button. With `target`, ui.js filters that table as you type. --}}
@props(['label', 'placeholder' => 'Search', 'target' => null])
@php($id = 'search-'.\Illuminate\Support\Str::slug($label))
<div {{ $attributes->class('ak-search') }}>
    <label for="{{ $id }}" class="sr-only">{{ $label }}</label>
    <x-ak.icon name="search" :size="15" class="ak-search__icon" />
    <input id="{{ $id }}" type="search" class="ak-search__input" placeholder="{{ $placeholder }}" autocomplete="off" spellcheck="false" @if ($target) data-ak-search="{{ $target }}" @endif>
    <button type="button" class="ak-search__clear" aria-label="Clear the search" title="Clear the search"><x-ak.icon name="x" :size="14" /></button>
</div>

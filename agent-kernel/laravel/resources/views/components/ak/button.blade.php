{{-- primary: orange, the one main action · secondary: outlined · quiet: text only · danger: stops work. --}}
@props(['variant' => 'primary', 'size' => 'md', 'href' => null])
@php
    $classes = ['ak-btn', "ak-btn--{$variant}", 'ak-btn--sm' => $size === 'sm'];
@endphp
@if ($href)
    <a href="{{ $href }}" {{ $attributes->class($classes) }}>{{ $slot }}</a>
@else
    <button type="button" {{ $attributes->class($classes) }}>{{ $slot }}</button>
@endif

{{-- The dot alone. Every status has its own shape, so colour is never the only cue. --}}
@props(['status'])
<span {{ $attributes->class(['ak-dot', "ak-dot--{$status}"]) }} aria-hidden="true"></span>

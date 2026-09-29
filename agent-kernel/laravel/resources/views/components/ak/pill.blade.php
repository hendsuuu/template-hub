@props(['tone' => 'neutral'])
<span {{ $attributes->class(['ak-pill', "ak-pill--{$tone}"]) }}>{{ $slot }}</span>

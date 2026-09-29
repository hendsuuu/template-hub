{{-- A tiny bar chart. With `history`, earlier bars are quieter than the last (the current period). --}}
@props(['bars', 'max' => null, 'history' => true])
@use('App\Support\AgentHub\Chart')
@php($top = max($max ?? 0, 1, ...array_column($bars, 'value')))
<span @class(['ak-minibars', 'ak-minibars--history' => $history]) aria-hidden="true">
    @foreach ($bars as $bar)
        <span @class(['ak-minibars__bar', 'ak-minibars__bar--'.$bar['tone'], 'ak-minibars__bar--zero' => $bar['value'] == 0]) style="--h: {{ Chart::percent($bar['value'], $top) }}" @isset($bar['title']) title="{{ $bar['title'] }}" @endisset></span>
    @endforeach
</span>

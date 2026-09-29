{{-- Jobs finished per day as thin columns with a soft fade and a faint track behind each. --}}
@props(['days', 'highlightLast' => 7])
@use('App\Support\AgentHub\Chart')
@use('App\Support\AgentHub\Format')
@php
    $totals = array_map(fn ($d) => $d['completed'] + $d['failed'], $days);
    $max = max(1, ...$totals);
    $period = array_sum(array_slice($totals, -$highlightLast));
@endphp
<figure>
    <div class="ak-histogram__plot" aria-hidden="true">
        @foreach ($days as $index => $day)
            <span @class(['ak-histogram__col', 'ak-histogram__col--dim' => $index < count($days) - $highlightLast]) title="{{ Format::day($day['day']) }}: {{ $totals[$index] }} finished">
                <span class="ak-histogram__track">
                    @if ($totals[$index] > 0)
                        <span class="ak-histogram__bar" style="--h: {{ Chart::percent($totals[$index], $max) }}"></span>
                    @endif
                </span>
            </span>
        @endforeach
    </div>
    <figcaption class="ak-histogram__caption">
        <span>{{ $days ? Format::day($days[0]['day']) : '' }}</span>
        <span class="ak-histogram__legend"><span class="ak-histogram__swatch" aria-hidden="true"></span>Finished, last {{ $highlightLast }} days: {{ $period }}</span>
        <span>{{ $days ? Format::day($days[count($days) - 1]['day']) : '' }}</span>
    </figcaption>
</figure>

{{--
    Fourteen days as columns: completed (green) with failed (red) stacked on top
    and a ring above for jobs that needed a person; or spend (blue). Built from
    HTML so it renders the same in every framework: hover or focus a day to read it.
--}}
@props(['days', 'mode'])
@use('App\Support\AgentHub\Chart')
@use('App\Support\AgentHub\Format')
@php
    $values = array_map(fn ($d) => $mode === 'jobs' ? $d['completed'] + $d['failed'] : (float) $d['spentUsd'], $days);
    $scale = Chart::niceScale((float) max(0, ...$values), integer: $mode === 'jobs');
    $ticks = array_map(fn ($t) => $mode === 'jobs' ? (string) (int) $t : Format::usdTick($t), $scale['ticks']);
    $axis = (int) ceil(max(array_map('strlen', $ticks)) * 6.6) + 12;
    $empty = array_sum($values) == 0;
    $describe = function (array $day): string {
        $jobs = $day['needsInput'] === 1 ? '1 job' : $day['needsInput'].' jobs';

        return Format::dayLong($day['day']).": {$day['completed']} completed, {$day['failed']} failed, {$jobs} needed a person, ".Format::usd((float) $day['spentUsd']).' spent.';
    };
@endphp
<div class="ak-chart" data-ak-mode="{{ $mode }}" role="group" aria-label="{{ $mode === 'jobs' ? 'Jobs per day, last 14 days' : 'Spend per day, last 14 days' }}" style="--ak-axis: {{ $axis }}px">
    <div class="ak-chart__plot">
        <div class="ak-chart__grid" aria-hidden="true">
            @foreach ($scale['ticks'] as $index => $tick)
                <div class="ak-chart__gridline" style="--y: {{ Chart::percent($tick, $scale['max']) }}"><span class="ak-chart__tick">{{ $ticks[$index] }}</span></div>
            @endforeach
        </div>
        <ol class="ak-chart__days">
            @foreach ($days as $index => $day)
                @php($total = $day['completed'] + $day['failed'])
                <li class="ak-chart__day" tabindex="0" aria-label="{{ $describe($day) }}">
                    <span class="ak-chart__stack" aria-hidden="true">
                        @if ($mode === 'jobs')
                            @if ($total === 0)
                                <span class="ak-chart__bar ak-chart__bar--zero"></span>
                            @else
                                @if ($day['completed'] > 0)
                                    <span class="ak-chart__bar ak-chart__bar--completed" style="--h: {{ Chart::percent($day['completed'], $scale['max']) }}"></span>
                                @endif
                                @if ($day['failed'] > 0)
                                    <span class="ak-chart__bar ak-chart__bar--failed" style="--h: {{ Chart::percent($day['failed'], $scale['max']) }}"></span>
                                @endif
                            @endif
                        @elseif ($day['spentUsd'] > 0)
                            <span class="ak-chart__bar ak-chart__bar--spend" style="--h: {{ Chart::percent((float) $day['spentUsd'], $scale['max']) }}"></span>
                        @else
                            <span class="ak-chart__bar ak-chart__bar--zero"></span>
                        @endif
                    </span>
                    @if ($mode === 'jobs' && $day['needsInput'] > 0)
                        <span class="ak-chart__marker" aria-hidden="true" style="--h: {{ Chart::percent($total, $scale['max']) }}"></span>
                    @endif
                    <span class="ak-chart__label" aria-hidden="true">{{ Format::day($day['day']) }}</span>
                    <div class="ak-chart__tooltip {{ $index < count($days) / 2 ? 'ak-chart__tooltip--right' : 'ak-chart__tooltip--left' }}" aria-hidden="true">
                        <p class="ak-tooltip__day">{{ Format::dayLong($day['day']) }}</p>
                        <dl class="ak-tooltip__rows">
                            <div class="ak-tooltip__row"><dt><span class="ak-key ak-key--green"></span>Completed</dt><dd>{{ $day['completed'] }}</dd></div>
                            <div class="ak-tooltip__row"><dt><span class="ak-key ak-key--red"></span>Failed</dt><dd>{{ $day['failed'] }}</dd></div>
                            <div class="ak-tooltip__row"><dt><span class="ak-key ak-key--ring"></span>Needed a person</dt><dd>{{ $day['needsInput'] }}</dd></div>
                            <div class="ak-tooltip__row"><dt><span class="ak-key ak-key--blue"></span>Spent</dt><dd>{{ Format::usd((float) $day['spentUsd']) }}</dd></div>
                        </dl>
                    </div>
                </li>
            @endforeach
        </ol>
        @if ($empty)
            <p class="ak-chart__empty">No activity in the last 14 days.</p>
        @endif
    </div>
    <div class="ak-chart__axis-space" aria-hidden="true"></div>
</div>

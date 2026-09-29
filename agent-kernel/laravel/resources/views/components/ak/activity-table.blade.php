{{-- The chart's numbers as a table, for screen readers (a hidden block, so it never widens a phone page). --}}
@props(['days'])
@use('App\Support\AgentHub\Format')
<div class="sr-only">
    <table>
        <caption>Activity by day, last 14 days (UTC)</caption>
        <thead>
            <tr><th scope="col">Day</th><th scope="col">Completed</th><th scope="col">Failed</th><th scope="col">Needed a person</th><th scope="col">Spent</th></tr>
        </thead>
        <tbody>
            @foreach ($days as $day)
                <tr><th scope="row">{{ Format::dayLong($day['day']) }}</th><td>{{ $day['completed'] }}</td><td>{{ $day['failed'] }}</td><td>{{ $day['needsInput'] }}</td><td>{{ Format::usd((float) $day['spentUsd']) }}</td></tr>
            @endforeach
        </tbody>
    </table>
</div>

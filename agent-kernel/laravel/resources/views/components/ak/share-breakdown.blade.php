{{-- Each agent's share of the work: name, role, count and share, each row with one neutral meter. --}}
@props(['items', 'roles'])
@use('App\Support\AgentHub\Nav')
@use('App\Support\AgentHub\Share')
@php
    $rows = Share::rows($items);
    $largest = max(1, ...array_column($rows, 'percent'));
@endphp
@if ($rows === [])
    <p class="ak-none">No agent started a job in the last 7 days.</p>
@else
    <ul class="ak-shares">
        @foreach ($rows as $row)
            <li>
                <{{ $row['other'] ? 'div' : 'a' }} @class(['ak-share', 'ak-share--other' => $row['other']]) @unless ($row['other']) href="{{ Nav::board($row['key']) }}" @endunless>
                    <span class="ak-share__name">{{ $row['other'] ? $row['key'].' agents' : $row['key'] }}</span>
                    <span class="ak-share__sub">{{ $row['other'] ? 'combined' : ($roles[$row['key']] ?? '') }}</span>
                    <span class="ak-share__count">{{ $row['count'] === 1 ? '1 job' : $row['count'].' jobs' }}</span>
                    <span class="ak-share__percent">{{ $row['percent'] === 0 ? '<1%' : $row['percent'].'%' }}</span>
                    <span class="ak-share__meter" aria-hidden="true"><span style="--w: {{ $row['percent'] / $largest * 100 }}%"></span></span>
                </{{ $row['other'] ? 'div' : 'a' }}>
            </li>
        @endforeach
    </ul>
@endif

{{-- Jobs as a table: ui.js sorts it from the headers; the job and the whole row open the job. --}}
@props(['id', 'jobs', 'now', 'caption', 'compact' => false])
@use('App\Support\AgentHub\Format')
@use('App\Support\AgentHub\Nav')
@use('App\Support\AgentHub\Status')
<div @class(['ak-table-wrap', 'ak-table-wrap--cards-sm' => $compact, 'ak-table-wrap--cards-md' => ! $compact])>
    <table @class(['ak-table', 'ak-table--compact' => $compact]) id="{{ $id }}" data-ak-sortable>
        <caption class="sr-only">{{ $caption }}</caption>
        <thead>
            <tr>
                <th scope="col" class="ak-job-cell"><x-ak.sort-button>Job</x-ak.sort-button></th>
                <th scope="col"><x-ak.sort-button>Agent</x-ak.sort-button></th>
                <th scope="col"><x-ak.sort-button>Status</x-ak.sort-button></th>
                @unless ($compact)
                    <th scope="col" class="is-end"><x-ak.sort-button>Attempts</x-ak.sort-button></th>
                @endunless
                <th scope="col" class="is-end"><x-ak.sort-button>Spent</x-ak.sort-button></th>
                <th scope="col"><x-ak.sort-button>Updated</x-ak.sort-button></th>
            </tr>
        </thead>
        <tbody>
            @foreach ($jobs as $job)
                @php($agent = Status::describeAssignee($job['heldBy'] ?? $job['assignee']))
                <tr class="ak-row--clickable" data-href="{{ Nav::job($job['jobId']) }}" data-search="{{ strtolower($job['jobId'].' '.$job['objective']) }}" data-status="{{ $job['status'] }}">
                    <td class="ak-job-cell is-primary" data-sort-value="{{ $job['objective'] }}">
                        <a href="{{ Nav::job($job['jobId']) }}" class="ak-job-link">
                            <span class="ak-job-link__id">{{ $job['jobId'] }}</span>
                            <span class="ak-job-link__objective">{{ $job['objective'] }}</span>
                        </a>
                    </td>
                    <td data-label="Agent" data-sort-value="{{ $agent }}"><span class="ak-wrap-anywhere">{{ $agent }}</span></td>
                    <td data-label="Status" data-sort-value="{{ Status::jobRank($job['status']) }}"><x-ak.job-status-tag :status="$job['status']" /></td>
                    @unless ($compact)
                        <td class="is-end" data-label="Attempts" data-sort-value="{{ $job['attempts'] }}">{{ $job['attempts'] }}</td>
                    @endunless
                    <td class="is-end" data-label="Spent" data-sort-value="{{ $job['spentUsd'] }}">
                        <span class="ak-nowrap">{{ Format::usd((float) $job['spentUsd']) }}@if (! $compact && $job['limitUsd'] !== null)<span class="ak-limit">of {{ Format::usd((float) $job['limitUsd']) }}</span>@endif</span>
                    </td>
                    <td data-label="Updated" data-sort-value="{{ -strtotime($job['updatedAt']) }}">
                        <time datetime="{{ $job['updatedAt'] }}" title="{{ Format::dateTime($job['updatedAt']) }}" class="ak-updated">{{ Format::ago($job['updatedAt'], $now) }}</time>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>

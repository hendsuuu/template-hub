{{--
    Agents as a table: ui.js sorts it from the headers, filters it from any search
    box or select that targets its id, and opens the agent's board from a row.
    Sorted by status to start, as in the React version.
--}}
@props(['id', 'agents', 'now', 'caption'])
@use('App\Support\AgentHub\Format')
@use('App\Support\AgentHub\Nav')
@use('App\Support\AgentHub\Status')
<div class="ak-table-wrap ak-table-wrap--cards-md">
    <table class="ak-table" id="{{ $id }}" data-ak-sortable>
        <caption class="sr-only">{{ $caption }}</caption>
        <thead>
            <tr>
                <th scope="col" class="ak-table__position"><span aria-hidden="true">#</span><span class="sr-only">Position</span></th>
                <th scope="col"><x-ak.sort-button>Agent</x-ak.sort-button></th>
                <th scope="col" aria-sort="ascending"><x-ak.sort-button>Status</x-ak.sort-button></th>
                <th scope="col" class="ak-work-cell">Current work</th>
                <th scope="col"><x-ak.sort-button>Last seen</x-ak.sort-button></th>
                <th scope="col"><x-ak.sort-button>Last 24 h</x-ak.sort-button></th>
                <th scope="col" class="is-end"><x-ak.sort-button>Queued</x-ak.sort-button></th>
            </tr>
        </thead>
        <tbody>
            @foreach (Status::sortAgents($agents) as $index => $agent)
                <tr class="ak-row--clickable" data-href="{{ Nav::board($agent['agentId']) }}" data-search="{{ strtolower($agent['agentId'].' '.$agent['role']) }}" data-status="{{ $agent['status'] }}">
                    <td class="ak-table__position is-wide-only" data-label="Position" data-ak-position>{{ $index + 1 }}</td>
                    <td class="is-primary" data-sort-value="{{ $agent['agentId'] }}">
                        <div class="ak-who">
                            <x-ak.agent-avatar />
                            <div class="ak-identity">
                                <a href="{{ Nav::board($agent['agentId']) }}" class="ak-agent-name">{{ $agent['agentId'] }}</a>
                                <span class="ak-role">{{ $agent['role'] }}</span>
                            </div>
                        </div>
                    </td>
                    <td data-label="Status" data-sort-value="{{ Status::agentRank($agent['status']) }}"><x-ak.status-badge :status="$agent['status']" /></td>
                    <td class="ak-work-cell" data-label="Current work">
                        @if ($agent['status'] === 'working' && $agent['currentJob'])
                            <div class="ak-work">
                                <a href="{{ Nav::job($agent['currentJob']['jobId']) }}" class="ak-job-id">{{ $agent['currentJob']['jobId'] }}</a>
                                <span class="ak-truncate">{{ $agent['currentJob']['objective'] }}@if ($agent['currentJob']['since'])<span class="ak-muted"> · {{ Format::elapsed($agent['currentJob']['since'], $now) }}</span>@endif</span>
                            </div>
                        @elseif ($agent['status'] === 'waiting')
                            <div class="ak-work">
                                <span class="ak-needs">Needs a person{{ $agent['waitingCount'] > 1 ? ' · '.$agent['waitingCount'].' jobs' : '' }}</span>
                                <span class="ak-truncate">{{ $agent['waitingJob'] ? ($agent['waitingJob']['reason'] ?? $agent['waitingJob']['objective']) : 'A job is waiting for a person.' }}</span>
                            </div>
                        @else
                            <span class="ak-muted">{{ match ($agent['status']) {
                                'working' => 'Working on a job',
                                'picking_up' => $agent['queuedFor'] > 1 ? $agent['queuedFor'].' jobs queued for it' : 'A job is queued for it',
                                'idle' => 'Nothing to do',
                                'never' => 'Registered '.Format::ago($agent['registeredAt'], $now),
                                'paused' => 'Paused by an operator',
                                default => 'No recent check-in',
                            } }}</span>
                        @endif
                    </td>
                    <td data-label="Last seen" data-sort-value="{{ $agent['lastSeenAt'] ? -strtotime($agent['lastSeenAt']) : '' }}">
                        @if ($agent['lastSeenAt'])
                            <time datetime="{{ $agent['lastSeenAt'] }}" title="{{ Format::dateTime($agent['lastSeenAt']) }}" class="ak-muted ak-nowrap">{{ Format::ago($agent['lastSeenAt'], $now) }}</time>
                        @else
                            <span class="ak-muted">Never</span>
                        @endif
                    </td>
                    <td data-label="Last 24 h" data-sort-value="{{ $agent['completed24h'] }}">
                        <span class="ak-nowrap">{{ $agent['completed24h'] }} done<span aria-hidden="true"> · </span><span class="sr-only">, </span><span @class(['ak-failed-text' => $agent['failed24h'] > 0])>{{ $agent['failed24h'] }} failed</span></span>
                    </td>
                    <td class="is-end" data-label="Queued" data-sort-value="{{ $agent['queuedFor'] }}">{{ $agent['queuedFor'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>

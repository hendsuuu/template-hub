<?php

declare(strict_types=1);

namespace App\Support\AgentHub;

/**
 * How agent and job statuses read on screen: a label (colour is never the only
 * signal), a one-line meaning, and a tone the stylesheet maps to a colour.
 * The same as lib/status.ts.
 */
final class Status
{
    /** Display order: what needs a person first, then live work. */
    public const AGENT = [
        'waiting' => ['label' => 'Waiting for you', 'meaning' => 'A job it worked on is waiting for a person.', 'tone' => 'orange'],
        'working' => ['label' => 'Working', 'meaning' => 'Holds a job and is sending heartbeats.', 'tone' => 'blue'],
        'picking_up' => ['label' => 'Picking up', 'meaning' => 'Online, and a job for it is queued. It takes it within one poll.', 'tone' => 'blue'],
        'idle' => ['label' => 'Idle', 'meaning' => 'Online with nothing to do.', 'tone' => 'green'],
        'not_responding' => ['label' => 'Not responding', 'meaning' => 'Seen in the last 15 minutes, but not recently.', 'tone' => 'red'],
        'offline' => ['label' => 'Offline', 'meaning' => 'Not seen for more than 15 minutes.', 'tone' => 'red'],
        'never' => ['label' => 'Not connected yet', 'meaning' => 'Registered, but has never connected to the hub.', 'tone' => 'grey'],
        'paused' => ['label' => 'Paused', 'meaning' => 'Switched off by an operator.', 'tone' => 'grey'],
    ];

    /** The job's path, then the side states. */
    public const JOB = [
        'queued' => ['label' => 'Queued', 'meaning' => 'Waiting for an agent to take it.', 'tone' => 'neutral'],
        'validating' => ['label' => 'Checking', 'meaning' => 'Being checked before it runs.', 'tone' => 'blue'],
        'running' => ['label' => 'Running', 'meaning' => 'An agent is working on it.', 'tone' => 'blue'],
        'verifying' => ['label' => 'Verifying', 'meaning' => 'The result is being checked against fresh data.', 'tone' => 'blue'],
        'completed' => ['label' => 'Completed', 'meaning' => 'Done, with acceptance evidence.', 'tone' => 'green'],
        'waiting_for_input' => ['label' => 'Waiting for a person', 'meaning' => 'Needs a person to answer or check something.', 'tone' => 'orange'],
        'waiting_for_auth' => ['label' => 'Waiting for sign-in', 'meaning' => 'Needs someone to sign in to a system.', 'tone' => 'orange'],
        'paused_budget' => ['label' => 'Paused: budget', 'meaning' => 'Stopped at its budget limit.', 'tone' => 'orange'],
        'blocked_dependency' => ['label' => 'Blocked', 'meaning' => 'Waiting on another job.', 'tone' => 'grey'],
        'failed' => ['label' => 'Failed', 'meaning' => 'Stopped and will not be retried on its own.', 'tone' => 'red'],
        'cancelled' => ['label' => 'Cancelled', 'meaning' => 'Cancelled by a person.', 'tone' => 'grey'],
    ];

    private const ONLINE = ['working', 'waiting', 'picking_up', 'idle'];

    private const WAITING = ['waiting_for_input', 'waiting_for_auth', 'paused_budget', 'blocked_dependency'];

    public static function isOnline(string $status): bool
    {
        return in_array($status, self::ONLINE, true);
    }

    public static function isWaiting(string $status): bool
    {
        return in_array($status, self::WAITING, true);
    }

    /** Position in the display order, for sorting by status. */
    public static function agentRank(string $status): int
    {
        return (int) array_search($status, array_keys(self::AGENT), true);
    }

    public static function jobRank(string $status): int
    {
        return (int) array_search($status, array_keys(self::JOB), true);
    }

    /**
     * Needs-a-person first, then live work, then the rest (stable within a status).
     *
     * @param  list<array<string, mixed>>  $agents
     * @return list<array<string, mixed>>
     */
    public static function sortAgents(array $agents): array
    {
        usort($agents, static fn (array $a, array $b): int => self::agentRank($a['status']) <=> self::agentRank($b['status']));

        return $agents;
    }

    /**
     * @param  list<array<string, mixed>>  $agents
     * @return array<string, int>
     */
    public static function countByStatus(array $agents): array
    {
        $counts = array_fill_keys(array_keys(self::AGENT), 0);
        foreach ($agents as $agent) {
            $counts[$agent['status']]++;
        }

        return $counts;
    }

    /** A list assignee is an agent id or `role:<role>`. */
    public static function describeAssignee(string $assignee): string
    {
        return str_starts_with($assignee, 'role:') ? 'Any '.substr($assignee, 5).' agent' : $assignee;
    }
}

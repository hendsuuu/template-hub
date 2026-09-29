<?php

declare(strict_types=1);

namespace App\Support\AgentHub;

use DateTimeImmutable;

/**
 * The template's data: one bundled snapshot (resources/data/hub.json), so every
 * page renders the same numbers as the other starters. Replace these methods
 * with calls to your API when you connect a real backend.
 */
final class Hub
{
    /** @var array<string, mixed>|null */
    private static ?array $snapshot = null;

    /** @return array<string, mixed> */
    public static function snapshot(): array
    {
        return self::$snapshot ??= json_decode((string) file_get_contents(resource_path('data/hub.json')), true, flags: JSON_THROW_ON_ERROR);
    }

    /** The snapshot's clock: every "5 minutes ago" is measured from here. */
    public static function now(): DateTimeImmutable
    {
        return new DateTimeImmutable(self::snapshot()['now']);
    }

    /** @return array{name: string, email: string, role: string} */
    public static function user(): array
    {
        return self::snapshot()['user'];
    }

    public static function tenantName(): string
    {
        return self::snapshot()['tenant']['name'];
    }

    public static function onlineSeconds(): int
    {
        return (int) self::snapshot()['onlineSeconds'];
    }

    /** @return list<array<string, mixed>> */
    public static function agents(): array
    {
        return self::snapshot()['agents'];
    }

    /** @return list<array<string, mixed>> Newest first. */
    public static function jobs(): array
    {
        return self::snapshot()['jobs'];
    }

    /** @return list<array<string, mixed>> The latest updates, for the overview. */
    public static function recentJobs(int $limit = 8): array
    {
        return array_slice(self::jobs(), 0, $limit);
    }

    /** @return list<array{day: string, completed: int, failed: int, needsInput: int, spentUsd: float}> */
    public static function activity(): array
    {
        return self::snapshot()['activity'];
    }

    /** @return array{last24hUsd: float, last7dUsd: float} */
    public static function spend(): array
    {
        return self::snapshot()['spend'];
    }

    /** @return list<array{agentId: string, jobs: int}> */
    public static function workByAgent(): array
    {
        return self::snapshot()['workByAgent'];
    }

    /** @return array{queued: int, running: int, waiting: int, completed24h: int, failed24h: int} */
    public static function jobCounts(): array
    {
        $dayAgo = self::now()->getTimestamp() - 24 * 60 * 60;
        $recent = static fn (array $job): bool => strtotime($job['updatedAt']) >= $dayAgo;
        $count = static fn (callable $test): int => count(array_filter(self::jobs(), $test));

        return [
            'queued' => $count(static fn ($job) => $job['status'] === 'queued'),
            'running' => $count(static fn ($job) => in_array($job['status'], ['validating', 'running', 'verifying'], true)),
            'waiting' => $count(static fn ($job) => Status::isWaiting($job['status'])),
            'completed24h' => $count(static fn ($job) => $job['status'] === 'completed' && $recent($job)),
            'failed24h' => $count(static fn ($job) => $job['status'] === 'failed' && $recent($job)),
        ];
    }
}

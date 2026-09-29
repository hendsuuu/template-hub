<?php

declare(strict_types=1);

namespace App\Support\AgentHub;

/** Part-to-whole rows for the "Work by agent" breakdown. The same as lib/share.ts. */
final class Share
{
    /** Named rows before the rest fold into one "more" row. */
    public const NAMED = 5;

    /**
     * Whole percentages that add up to exactly 100 (largest remainder).
     *
     * @param  list<int>  $counts
     * @return list<int>
     */
    public static function wholePercents(array $counts): array
    {
        $total = array_sum($counts);
        if ($total <= 0) {
            return array_map(static fn () => 0, $counts);
        }
        $exact = array_map(static fn (int $n): float => $n / $total * 100, $counts);
        $floors = array_map(static fn (float $n): int => (int) floor($n), $exact);
        $left = 100 - array_sum($floors);
        $order = array_keys($exact);
        usort($order, static fn (int $a, int $b): int => [$exact[$b] - floor($exact[$b]), $a] <=> [$exact[$a] - floor($exact[$a]), $b]);
        foreach ($order as $index) {
            if ($left <= 0) {
                break;
            }
            $floors[$index]++;
            $left--;
        }

        return $floors;
    }

    /**
     * @param  list<array{agentId: string, jobs: int}>  $items
     * @return list<array{key: string, count: int, percent: int, other: bool}>
     */
    public static function rows(array $items): array
    {
        $sorted = array_values(array_filter($items, static fn (array $item): bool => $item['jobs'] > 0));
        usort($sorted, static fn (array $a, array $b): int => [$b['jobs'], $a['agentId']] <=> [$a['jobs'], $b['agentId']]);
        $named = count($sorted) > self::NAMED + 1 ? array_slice($sorted, 0, self::NAMED) : $sorted;
        $rest = array_slice($sorted, count($named));
        $rows = array_map(static fn (array $item): array => ['key' => $item['agentId'], 'count' => $item['jobs'], 'other' => false], $named);
        if ($rest !== []) {
            $rows[] = ['key' => count($rest).' more', 'count' => array_sum(array_column($rest, 'jobs')), 'other' => true];
        }
        $percents = self::wholePercents(array_column($rows, 'count'));

        return array_map(static fn (array $row, int $percent): array => [...$row, 'percent' => $percent], $rows, $percents);
    }
}

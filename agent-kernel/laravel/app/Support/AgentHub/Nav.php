<?php

declare(strict_types=1);

namespace App\Support\AgentHub;

/** Every address in the template, and the main navigation. */
final class Nav
{
    /** @var list<array{href: string, label: string, icon: string, exact?: bool}> */
    public const ITEMS = [
        ['href' => '/', 'label' => 'Overview', 'icon' => 'layout-dashboard', 'exact' => true],
        ['href' => '/agents', 'label' => 'Agents', 'icon' => 'bot'],
        ['href' => '/board', 'label' => 'Board', 'icon' => 'square-kanban'],
        ['href' => '/jobs', 'label' => 'Jobs', 'icon' => 'list-checks'],
        ['href' => '/schedules', 'label' => 'Schedules', 'icon' => 'calendar-clock'],
        ['href' => '/components', 'label' => 'Components', 'icon' => 'blocks'],
    ];

    public static function board(?string $agent = null): string
    {
        return '/board'.($agent ? '?agent='.rawurlencode($agent) : '');
    }

    public static function job(string $jobId): string
    {
        return '/jobs/'.rawurlencode($jobId);
    }

    /** @param  array{href: string, exact?: bool}  $item */
    public static function isActive(array $item, string $path): bool
    {
        $path = '/'.trim($path, '/');

        return ($item['exact'] ?? false) ? $path === $item['href'] : $path === $item['href'] || str_starts_with($path, $item['href'].'/');
    }

    /** @return array{label: string, icon: string} The nav item a path belongs to, or the not-found page's. */
    public static function pageFor(string $path): array
    {
        foreach (self::ITEMS as $item) {
            if (self::isActive($item, $path)) {
                return ['label' => $item['label'], 'icon' => $item['icon']];
            }
        }

        return ['label' => 'Page not found', 'icon' => 'compass'];
    }
}

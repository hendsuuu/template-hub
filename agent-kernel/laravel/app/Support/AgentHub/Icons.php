<?php

declare(strict_types=1);

namespace App\Support\AgentHub;

/**
 * Lucide icons as inline SVG, read from resources/svg/lucide. Copy another
 * icon's file there (from the lucide-static package) to use it.
 */
final class Icons
{
    /** @var array<string, string> */
    private static array $inner = [];

    public static function svg(string $name, int $size = 16, ?string $class = null, float $strokeWidth = 2): string
    {
        $inner = self::$inner[$name] ??= self::read($name);
        $class = htmlspecialchars(trim('lucide '.($class ?? '')), ENT_QUOTES);

        return sprintf(
            '<svg xmlns="http://www.w3.org/2000/svg" width="%1$d" height="%1$d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="%2$s" stroke-linecap="round" stroke-linejoin="round" class="%3$s" aria-hidden="true">%4$s</svg>',
            $size,
            $strokeWidth,
            $class,
            $inner,
        );
    }

    private static function read(string $name): string
    {
        $path = resource_path('svg/lucide/'.basename($name).'.svg');
        $svg = is_file($path) ? (string) file_get_contents($path) : '';

        return preg_match('/<svg[^>]*>(.*)<\/svg>/s', $svg, $match) === 1 ? $match[1] : '';
    }
}

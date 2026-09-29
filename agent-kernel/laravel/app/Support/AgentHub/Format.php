<?php

declare(strict_types=1);

namespace App\Support\AgentHub;

use DateTimeImmutable;
use DateTimeZone;

/**
 * Times, money and names as the dashboard shows them: en-GB, 24-hour clock in
 * Europe/London, US dollars for model spend. The same output as lib/format.ts.
 */
final class Format
{
    public const TIME_ZONE = 'Europe/London';

    private const MINUTE = 60;
    private const HOUR = 3600;
    private const DAY = 86400;

    /** en-GB's short months: "Sept", not "Sep". */
    private const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    private static function plural(int $n, string $unit): string
    {
        return $n.' '.$unit.($n === 1 ? '' : 's');
    }

    private static function secondsSince(string $iso, DateTimeImmutable $now): float
    {
        $time = strtotime($iso);

        return $time === false ? NAN : (float) ($now->getTimestamp() - $time);
    }

    private static function duration(float $seconds): string
    {
        return match (true) {
            $seconds < self::HOUR => self::plural((int) floor($seconds / self::MINUTE), 'minute'),
            $seconds < self::DAY => self::plural((int) floor($seconds / self::HOUR), 'hour'),
            $seconds < 30 * self::DAY => self::plural((int) floor($seconds / self::DAY), 'day'),
            $seconds < 365 * self::DAY => self::plural((int) floor($seconds / (30 * self::DAY)), 'month'),
            default => self::plural((int) floor($seconds / (365 * self::DAY)), 'year'),
        };
    }

    /** "less than a minute", "12 minutes", "3 hours". */
    public static function elapsed(string $fromIso, DateTimeImmutable $now): string
    {
        $raw = self::secondsSince($fromIso, $now);
        $seconds = is_nan($raw) ? 0 : max(0, $raw);

        return $seconds < self::MINUTE ? 'less than a minute' : self::duration($seconds);
    }

    /** "just now", "12 minutes ago", "3 hours ago". */
    public static function ago(string $iso, DateTimeImmutable $now): string
    {
        $raw = self::secondsSince($iso, $now);

        return is_nan($raw) || $raw < self::MINUTE ? 'just now' : self::duration($raw).' ago';
    }

    private static function zoned(string $iso): DateTimeImmutable
    {
        return (new DateTimeImmutable($iso))->setTimezone(new DateTimeZone(self::TIME_ZONE));
    }

    /** "14:03:07". */
    public static function clock(DateTimeImmutable $date): string
    {
        return $date->setTimezone(new DateTimeZone(self::TIME_ZONE))->format('H:i:s');
    }

    /** "28 Sept 2026, 14:03". */
    public static function dateTime(string $iso): string
    {
        $date = self::zoned($iso);

        return $date->format('j').' '.self::MONTHS[(int) $date->format('n') - 1].' '.$date->format('Y, H:i');
    }

    /** An activity day (YYYY-MM-DD, UTC) as "15 Sept". */
    public static function day(string $day): string
    {
        $date = new DateTimeImmutable($day.'T00:00:00Z');

        return $date->format('j').' '.self::MONTHS[(int) $date->format('n') - 1];
    }

    /** An activity day as "Tuesday 15 September". */
    public static function dayLong(string $day): string
    {
        return (new DateTimeImmutable($day.'T00:00:00Z'))->format('l j F');
    }

    /** "$1,234.50", "$0.42"; below ten cents up to four decimals, so a small cost never reads as zero. */
    public static function usd(float $amount): string
    {
        if (! is_finite($amount)) {
            return '–';
        }
        $size = abs($amount);
        if ($size === 0.0) {
            return '$0.00';
        }
        if ($size < 0.0001) {
            return '<$0.0001';
        }
        $sign = $amount < 0 ? '-' : '';
        if ($size < 0.1) {
            $text = rtrim(number_format($size, 4, '.', ','), '0');
            $decimals = strlen(substr((string) strrchr($text, '.'), 1));

            return $sign.'$'.($decimals < 2 ? number_format($size, 2, '.', ',') : $text);
        }

        return $sign.'$'.number_format($size, 2, '.', ',');
    }

    /** Axis ticks: "$0", "$2", "$0.50". */
    public static function usdTick(float $amount): string
    {
        if ($amount == 0.0) {
            return '$0';
        }

        return floor($amount) == $amount ? '$'.number_format($amount, 0, '.', ',') : self::usd($amount);
    }

    /** A change between two periods as a whole percentage, or null when there is nothing to compare with. */
    public static function percentChange(float $current, float $previous): ?int
    {
        return $previous > 0 ? (int) round(($current - $previous) / $previous * 100) : null;
    }

    /** "Alex Morgan" → "Alex". */
    public static function firstName(string $name): string
    {
        return preg_split('/\s+/', trim($name))[0] ?? '';
    }

    /** "Alex Morgan" → "AM", "Sam" → "S". */
    public static function initials(string $name): string
    {
        $words = array_values(array_filter(preg_split('/\s+/', trim($name)) ?: []));
        $first = mb_substr($words[0] ?? '', 0, 1);
        $last = count($words) > 1 ? mb_substr($words[count($words) - 1], 0, 1) : '';

        return mb_strtoupper($first.$last) ?: '?';
    }
}

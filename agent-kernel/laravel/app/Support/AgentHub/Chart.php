<?php

declare(strict_types=1);

namespace App\Support\AgentHub;

/** Helpers for the HTML charts: the axis scale, and sizes as CSS custom properties. */
final class Chart
{
    /**
     * A y axis from 0 with about `count` round steps (1, 2, 2.5 or 5 times a
     * power of ten; whole numbers only for counts). The same as lib/chart.ts.
     *
     * @return array{max: float, ticks: list<float>}
     */
    public static function niceScale(float $dataMax, int $count = 4, bool $integer = false): array
    {
        $max = $dataMax > 0 && is_finite($dataMax) ? $dataMax : ($integer ? $count : 1);
        $rough = $max / $count;
        $power = 10 ** floor(log10($rough));
        $multiples = $integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10];
        $multiple = 10;
        foreach ($multiples as $candidate) {
            if ($candidate * $power >= $rough) {
                $multiple = $candidate;
                break;
            }
        }
        $step = $multiple * $power;
        if ($integer) {
            $step = max(1, round($step));
        }
        $top = self::tidy(ceil(self::tidy($max / $step)) * $step);
        $ticks = [];
        for ($value = 0.0; $value <= $top + $step / 1000; $value = self::tidy($value + $step)) {
            $ticks[] = $value;
        }

        return ['max' => $top, 'ticks' => $ticks];
    }

    private static function tidy(float $n): float
    {
        return (float) sprintf('%.12g', $n);
    }

    /** A share of a whole as a CSS percentage, "37.5%". */
    public static function percent(float $value, float $of): string
    {
        if (! ($of > 0) || ! is_finite($value)) {
            return '0%';
        }

        return rtrim(rtrim(number_format($value / $of * 100, 2, '.', ''), '0'), '.').'%';
    }
}

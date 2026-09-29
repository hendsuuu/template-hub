/**
 * Times, money and names as the dashboard shows them: en-GB, 24-hour clock,
 * US dollars for model spend. Clock times are shown in one fixed time zone so a
 * server render and the browser always agree.
 */

export const TIME_ZONE = "Europe/London";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? "" : "s"}`;
}

/** Seconds from `iso` to `now`; negative when `iso` is in the future, NaN when unreadable. */
function secondsSince(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / 1000;
}

/** A positive number of seconds in the largest whole unit: "12 minutes", "3 hours", "2 days". */
function duration(seconds: number): string {
  if (seconds < HOUR) return plural(Math.floor(seconds / MINUTE), "minute");
  if (seconds < DAY) return plural(Math.floor(seconds / HOUR), "hour");
  if (seconds < 30 * DAY) return plural(Math.floor(seconds / DAY), "day");
  if (seconds < 365 * DAY) return plural(Math.floor(seconds / (30 * DAY)), "month");
  return plural(Math.floor(seconds / (365 * DAY)), "year");
}

/** How long since `fromIso`: "less than a minute", "12 minutes", "3 hours", "2 days". */
export function formatElapsed(fromIso: string, now: Date): string {
  const raw = secondsSince(fromIso, now);
  const s = Number.isFinite(raw) ? Math.max(0, raw) : 0;
  return s < MINUTE ? "less than a minute" : duration(s);
}

/** "just now", "12 minutes ago", "3 hours ago". */
export function formatAgo(iso: string, now: Date): string {
  const raw = secondsSince(iso, now);
  return !Number.isFinite(raw) || raw < MINUTE ? "just now" : `${duration(raw)} ago`;
}

/** For tight spaces such as board cards: "just now", "5 min ago", "3 h ago", "2 d ago". */
export function formatAgoShort(iso: string, now: Date): string {
  const raw = secondsSince(iso, now);
  if (!Number.isFinite(raw) || raw < MINUTE) return "just now";
  if (raw < HOUR) return `${Math.floor(raw / MINUTE)} min ago`;
  if (raw < DAY) return `${Math.floor(raw / HOUR)} h ago`;
  if (raw < 30 * DAY) return `${Math.floor(raw / DAY)} d ago`;
  if (raw < 365 * DAY) return `${Math.floor(raw / (30 * DAY))} mo ago`;
  return `${Math.floor(raw / (365 * DAY))} y ago`;
}

/** When something scheduled runs next: "in 18 hours"; a time already passed reads "due now". */
export function formatUntil(iso: string, now: Date): string {
  const raw = secondsSince(iso, now);
  if (!Number.isFinite(raw)) return "";
  return raw > -MINUTE ? "due now" : `in ${duration(-raw)}`;
}

const zoned = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, ...options });

const clock = zoned({ hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
const hourMinute = zoned({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const dayMonth = zoned({ day: "numeric", month: "short" });
const calendarDay = zoned({ year: "numeric", month: "2-digit", day: "2-digit" });
const dateTime = zoned({ day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const shortDateTime = zoned({ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const shortDateTimeYear = zoned({
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const yearOnly = zoned({ year: "numeric" });

// Activity days are UTC calendar days, so they are labelled in UTC.
const dayShort = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const dayLong = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** "Mon 5 Oct, 09:00"; the year only when it is not the current one. */
export function formatWhen(iso: string, now: Date): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const sameYear = yearOnly.format(date) === yearOnly.format(now);
  return (sameYear ? shortDateTime : shortDateTimeYear).format(date).replace(/^(\w+),/, "$1");
}

/** "14:03:07". */
export function formatClock(date: Date): string {
  return clock.format(date);
}

/** "14:03". */
export function formatHourMinute(date: Date): string {
  return hourMinute.format(date);
}

/** "14:03" when `iso` falls on the same day as `now`, else "27 Sept". */
export function formatTimeOrDay(iso: string, now: Date): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return calendarDay.format(date) === calendarDay.format(now) ? hourMinute.format(date) : dayMonth.format(date);
}

/** "28 Sept 2026, 14:03". */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateTime.format(date);
}

function utcDay(day: string): Date | null {
  const date = new Date(`${day}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** An activity day (YYYY-MM-DD, UTC) as "15 Sept". */
export function formatDay(day: string): string {
  const date = utcDay(day);
  return date ? dayShort.format(date) : day;
}

/** An activity day as "Tuesday 15 September". */
export function formatDayLong(day: string): string {
  const date = utcDay(day);
  return date ? dayLong.format(date).replace(",", "") : day;
}

const usd = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const usdSmall = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

/**
 * "$1,234.50", "$0.42". Below ten cents up to four decimals, so a small model
 * cost never reads as zero ("$0.0042"); below a hundredth of a cent "<$0.0001".
 */
export function formatUsd(amount: number): string {
  if (!Number.isFinite(amount)) return "–";
  const size = Math.abs(amount);
  if (size === 0) return usd.format(0);
  if (size < 0.0001) return "<$0.0001";
  return size < 0.1 ? usdSmall.format(amount) : usd.format(amount);
}

/** Axis ticks: "$0", "$2", "$0.50". */
export function formatUsdTick(amount: number): string {
  if (amount === 0) return "$0";
  if (Number.isInteger(amount)) return `$${amount.toLocaleString("en-GB")}`;
  return formatUsd(amount);
}

/** "$1.20 of $5.00", or "$1.20 (no limit)". */
export function formatBudget(spentUsd: number, limitUsd: number | null): string {
  return limitUsd === null ? `${formatUsd(spentUsd)} (no limit)` : `${formatUsd(spentUsd)} of ${formatUsd(limitUsd)}`;
}

/** A change between two periods as a whole percentage, or null when there is nothing to compare with. */
export function percentChange(current: number, previous: number): number | null {
  if (!(previous > 0) || !Number.isFinite(current)) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/** "Alex Morgan" → "Alex". */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

/** "Alex Morgan" → "AM", "Sam" → "S". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

/** "leads-01" → "L1", "crm-migration-01" → "CM": two letters for an agent's avatar. */
export function agentInitials(agentId: string): string {
  const parts = agentId.split("-").filter(Boolean);
  const words = parts.filter((part) => !/^\d+$/.test(part));
  const number = parts.find((part) => /^\d+$/.test(part));
  const first = words[0]?.[0] ?? agentId[0] ?? "?";
  const second = words.length > 1 ? (words[1]?.[0] ?? "") : number ? String(Number(number)) : "";
  return (first + second).toUpperCase();
}

import { Temporal } from "temporal-polyfill";

/**
 * Centralized date/time formatting for the whole app.
 *
 * Every display date goes through this module so format and timezone stay
 * consistent. Defaults: es-AR locale, Argentina timezone, dd/mm/yyyy.
 * Callers may override per call ({ timeZone, locale }) or reconfigure the
 * module-wide defaults via configureDatetimeDefaults.
 *
 * Two value shapes are supported and told apart on purpose:
 * - Date-only strings ("2015-03-10") are calendar dates: they format to the
 *   same day in any timezone (Temporal.PlainDate, never a UTC instant).
 * - Datetime strings and Date objects are instants: they are rendered in the
 *   configured timezone.
 */

export const DEFAULT_TIME_ZONE = "America/Argentina/Buenos_Aires";
export const DEFAULT_LOCALE = "es-AR";

export interface DatetimeDefaults {
    timeZone: string;
    locale: string;
}

export interface FormatConfig {
    timeZone?: string;
    locale?: string;
}

let defaults: DatetimeDefaults = { timeZone: DEFAULT_TIME_ZONE, locale: DEFAULT_LOCALE };

/** Override the module-wide defaults (e.g. from app bootstrap). Returns the effective defaults. */
export function configureDatetimeDefaults(partial: Partial<DatetimeDefaults> = {}): DatetimeDefaults {
    defaults = { ...defaults, ...partial };
    return { ...defaults };
}

/** ISO date-only string, e.g. "2015-03-10". */
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type ResolvedValue = Temporal.PlainDate | Temporal.ZonedDateTime;

function resolveValue(value: string | Date, timeZone: string): ResolvedValue {
    if (value instanceof Date) {
        return Temporal.Instant.fromEpochMilliseconds(value.getTime()).toZonedDateTimeISO(timeZone);
    }
    if (DATE_ONLY_PATTERN.test(value)) {
        return Temporal.PlainDate.from(value);
    }
    try {
        return Temporal.Instant.from(value).toZonedDateTimeISO(timeZone);
    } catch {
        // Naive datetime string (no offset): interpret it in the configured zone.
        return Temporal.PlainDateTime.from(value).toZonedDateTime(timeZone);
    }
}

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hourCycle: "h23" };

function withDefaults(config?: FormatConfig): DatetimeDefaults {
    return { ...defaults, ...config };
}

/** "dd/mm/yyyy". Date-only values keep their calendar day in any timezone. */
export function formatDate(value: string | Date, config?: FormatConfig): string {
    const { locale, timeZone } = withDefaults(config);
    return resolveValue(value, timeZone).toLocaleString(locale, DATE_OPTIONS);
}

/** "dd/mm/yyyy, HH:mm" (24h). Requires a datetime value, not a bare date. */
export function formatDateTime(value: string | Date, config?: FormatConfig): string {
    const { locale, timeZone } = withDefaults(config);
    const resolved = resolveValue(value, timeZone);
    if (resolved instanceof Temporal.PlainDate) {
        throw new Error("formatDateTime requires a datetime value; received a date-only string");
    }
    return resolved.toLocaleString(locale, { ...DATE_OPTIONS, ...TIME_OPTIONS });
}

/** "HH:mm" (24h). Requires a datetime value, not a bare date. */
export function formatTime(value: string | Date, config?: FormatConfig): string {
    const { locale, timeZone } = withDefaults(config);
    const resolved = resolveValue(value, timeZone);
    if (resolved instanceof Temporal.PlainDate) {
        throw new Error("formatTime requires a datetime value; received a date-only string");
    }
    return resolved.toLocaleString(locale, TIME_OPTIONS);
}

/** Escape hatch with full Intl.DateTimeFormatOptions control; the timezone stays configured. */
export function formatDateWith(
    value: string | Date,
    options: Intl.DateTimeFormatOptions,
    config?: FormatConfig,
): string {
    const { locale, timeZone } = withDefaults(config);
    const intlOptions: Intl.DateTimeFormatOptions = { ...options };
    delete intlOptions.timeZone; // The zone comes from config, never from the options bag.
    return resolveValue(value, timeZone).toLocaleString(locale, intlOptions);
}

/** Parse "YYYY-MM-DD" into a calendar date with no timezone involvement. */
export function parseDateOnly(value: string): Temporal.PlainDate {
    return Temporal.PlainDate.from(value);
}

/** "YYYY-MM-DD" -> local-midnight Date for date inputs; undefined when empty or invalid. */
export function parseYmdToLocalDate(value: string): Date | undefined {
    if (!value) return undefined;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return undefined;
    // Reject rollovers (2026-13-01, 2026-02-30): the constructed date must round-trip.
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return undefined;
    }
    return date;
}

/** Date -> "YYYY-MM-DD" using local calendar parts (never UTC-shifted). */
export function toYmdString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/** Today at local midnight, for date-picker fallbacks. */
export function localTodayMidnight(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

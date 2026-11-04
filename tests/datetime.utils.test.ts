import { beforeEach, describe, expect, it } from "vitest";

import {
    DEFAULT_LOCALE,
    DEFAULT_TIME_ZONE,
    configureDatetimeDefaults,
    formatDate,
    formatDateWith,
    formatDateTime,
    formatTime,
    localTodayMidnight,
    parseDateOnly,
    parseYmdToLocalDate,
    toYmdString,
} from "../src/features/shared/utils/dates.utils";

describe("dates.utils (centralized datetime formatting)", () => {
    beforeEach(() => {
        configureDatetimeDefaults({ timeZone: DEFAULT_TIME_ZONE, locale: DEFAULT_LOCALE });
    });

    describe("formatDate", () => {
        it("formats a date-only string without timezone shift (calendar-date semantics)", () => {
            expect(formatDate("2015-03-10")).toBe("10/03/2015");
        });

        it("formats an instant in the default Argentina timezone", () => {
            // 02:30 UTC on Nov 4 is 23:30 of Nov 3 in UTC-3.
            expect(formatDate("2026-11-04T02:30:00Z")).toBe("03/11/2026");
        });

        it("honors a per-call timezone override", () => {
            expect(formatDate("2026-11-04T02:30:00Z", { timeZone: "UTC" })).toBe("04/11/2026");
        });

        it("formats a Date input as an instant", () => {
            expect(formatDate(new Date("2026-11-04T02:30:00Z"))).toBe("03/11/2026");
        });

        it("throws on unparseable values", () => {
            expect(() => formatDate("not-a-date")).toThrow();
        });
    });

    describe("formatDateTime", () => {
        it("renders dd/mm/yyyy, HH:mm (24h) in the default timezone", () => {
            expect(formatDateTime("2026-11-04T02:30:00Z")).toBe("03/11/2026, 23:30");
        });

        it("rejects date-only values (no meaningful time to show)", () => {
            expect(() => formatDateTime("2026-11-04")).toThrow();
        });
    });

    describe("formatTime", () => {
        it("renders HH:mm (24h) in the default timezone", () => {
            expect(formatTime("2026-11-04T02:30:00Z")).toBe("23:30");
        });
    });

    describe("formatDateWith (escape hatch)", () => {
        it("supports custom Intl options", () => {
            expect(formatDateWith("2026-11-04", { day: "numeric", month: "2-digit", year: "numeric" })).toBe(
                "4/11/2026",
            );
        });
    });

    describe("date-only helpers", () => {
        it("parseDateOnly returns a PlainDate for YYYY-MM-DD", () => {
            expect(parseDateOnly("2015-03-10").toString()).toBe("2015-03-10");
        });

        it("parseYmdToLocalDate builds a local-midnight Date and rejects invalid input", () => {
            const parsed = parseYmdToLocalDate("2026-11-04");
            expect(parsed).toBeInstanceOf(Date);
            expect(parsed?.getFullYear()).toBe(2026);
            expect(parsed?.getMonth()).toBe(10);
            expect(parsed?.getDate()).toBe(4);
            expect(parseYmdToLocalDate("")).toBeUndefined();
            expect(parseYmdToLocalDate("2026-13-01")).toBeUndefined();
        });

        it("toYmdString renders the local calendar day (never shifted by UTC)", () => {
            expect(toYmdString(new Date(2026, 10, 4, 23, 30))).toBe("2026-11-04");
        });
    });

    describe("localTodayMidnight", () => {
        it("returns today at local midnight", () => {
            const today = localTodayMidnight();
            expect(today.getHours()).toBe(0);
            expect(today.getMinutes()).toBe(0);
            expect(today.getSeconds()).toBe(0);
        });
    });

    describe("configureDatetimeDefaults", () => {
        it("changes the module defaults for subsequent calls", () => {
            configureDatetimeDefaults({ locale: "en-US", timeZone: "UTC" });
            expect(formatDate("2015-03-10")).toBe("03/10/2015");
        });
    });
});

import { describe, expect, it } from "vitest";

import {
    activeCursorStack,
    computeRecordsRange,
    formatRecordsRange,
    initialCursorNav,
    popCursorEntry,
    pushCursorEntry,
} from "./paginationState";

describe("computeRecordsRange", () => {
    it("starts the first page at row 1", () => {
        expect(computeRecordsRange(0, 10, 137)).toEqual({ from: 1, to: 10, total: 137 });
    });

    it("advances the range by the offset of the page", () => {
        expect(computeRecordsRange(10, 10, 137)).toEqual({ from: 11, to: 20, total: 137 });
    });

    it("closes a partial last page at its last row", () => {
        expect(computeRecordsRange(20, 3, 23)).toEqual({ from: 21, to: 23, total: 23 });
    });

    it("never shows a last row beyond the total", () => {
        expect(computeRecordsRange(95, 10, 100)).toEqual({ from: 96, to: 100, total: 100 });
    });

    it("reports a page without rows as 0-0", () => {
        expect(computeRecordsRange(0, 0, 0)).toEqual({ from: 0, to: 0, total: 0 });
    });

    it("clamps a negative offset back to the first row", () => {
        expect(computeRecordsRange(-10, 5, 50)).toEqual({ from: 1, to: 5, total: 50 });
    });
});

describe("formatRecordsRange", () => {
    it("renders the spec counter text verbatim", () => {
        expect(formatRecordsRange({ from: 1, to: 10, total: 137 })).toBe("1–10 de 137 registros");
    });
});

describe("cursor stack", () => {
    const firstPage = { cursor: null, offset: 0 };
    const secondPage = { cursor: "cursor-1", offset: 10 };

    it("starts empty for a filter signature", () => {
        const nav = initialCursorNav('["borrego"]');
        expect(activeCursorStack(nav, '["borrego"]')).toEqual([]);
    });

    it("keeps visited pages while the filters stay the same", () => {
        const nav = pushCursorEntry(pushCursorEntry(initialCursorNav("s"), "s", firstPage), "s", secondPage);
        expect(activeCursorStack(nav, "s")).toEqual([firstPage, secondPage]);
    });

    it("clears the stack when the filter signature changes", () => {
        const nav = pushCursorEntry(initialCursorNav("s1"), "s1", firstPage);
        expect(activeCursorStack(nav, "s2")).toEqual([]);
    });

    it("does not duplicate the page already on top", () => {
        const nav = pushCursorEntry(pushCursorEntry(initialCursorNav("s"), "s", firstPage), "s", firstPage);
        expect(activeCursorStack(nav, "s")).toEqual([firstPage]);
    });

    it("pops back to the last visited page", () => {
        const nav = pushCursorEntry(pushCursorEntry(initialCursorNav("s"), "s", firstPage), "s", secondPage);
        const popped = popCursorEntry(nav, "s");
        expect(popped.target).toEqual(secondPage);
        expect(activeCursorStack(popped.nav, "s")).toEqual([firstPage]);
    });

    it("has nothing to go back to on the first page", () => {
        const popped = popCursorEntry(initialCursorNav("s"), "s");
        expect(popped.target).toBeNull();
        expect(activeCursorStack(popped.nav, "s")).toEqual([]);
    });
});

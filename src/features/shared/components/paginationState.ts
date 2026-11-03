/**
 * Pure state helpers behind the T8 cursor navigation UI (S1/S3).
 *
 * The visited pages live in a stack keyed by the filter signature: a filter
 * change invalidates the stack, which is how "filter changes clear cursor
 * state" stays synchronous without effects racing the query refetch.
 */

export type CursorStackEntry = {
    /** Cursor that page's request was sent with; null on the first page. */
    cursor: string | null;
    /** Offset that page's request was sent with; display base of its rows. */
    offset: number;
};

export type CursorNavState = {
    /** Filters the stack belongs to; a different signature empties it. */
    signature: string;
    /** Visited pages from the first page up to the one before the current. */
    stack: CursorStackEntry[];
};

export const initialCursorNav = (signature: string): CursorNavState => ({ signature, stack: [] });

/** Stack valid for the given filters; a signature change clears cursor state. */
export const activeCursorStack = (nav: CursorNavState, signature: string): CursorStackEntry[] =>
    nav.signature === signature ? nav.stack : [];

/** Stack after visiting the next page: records the page being left behind. */
export const pushCursorEntry = (
    nav: CursorNavState,
    signature: string,
    entry: CursorStackEntry,
): CursorNavState => {
    const stack = activeCursorStack(nav, signature);
    const top = stack[stack.length - 1];
    // The page already on top means the click raced the params refetch
    // (double click): recording it again would need two visits to go back.
    if (top && top.cursor === entry.cursor && top.offset === entry.offset) {
        return { signature, stack };
    }
    return { signature, stack: [...stack, entry] };
};

/** Stack + page restored after going one page back; target null at the first. */
export const popCursorEntry = (
    nav: CursorNavState,
    signature: string,
): { nav: CursorNavState; target: CursorStackEntry | null } => {
    const stack = activeCursorStack(nav, signature);
    return {
        nav: { signature, stack: stack.slice(0, -1) },
        target: stack[stack.length - 1] ?? null,
    };
};

export type RecordsRange = {
    /** First row of the page (X). */
    from: number;
    /** Last row of the page (Y). */
    to: number;
    /** Rows matching the filters (Z). */
    total: number;
};

/** "X–Y de Z registros" math: rows offset+1 … offset+count over the total. */
export const computeRecordsRange = (offset: number, count: number, total: number): RecordsRange => {
    const safeOffset = Number.isFinite(offset) && offset > 0 ? Math.floor(offset) : 0;
    const safeCount = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
    const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;
    if (safeCount === 0) return { from: 0, to: 0, total: safeTotal };
    return { from: safeOffset + 1, to: Math.min(safeOffset + safeCount, safeTotal), total: safeTotal };
};

/** Verbatim S3 counter label. */
export const formatRecordsRange = ({ from, to, total }: RecordsRange): string =>
    `${from}–${to} de ${total} registros`;

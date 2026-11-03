import { useState } from "react";

import RecordsCounter from "./RecordsCounter.component";
import {
    activeCursorStack,
    initialCursorNav,
    popCursorEntry,
    pushCursorEntry,
    type CursorNavState,
} from "./paginationState";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination";

interface CursorPaginationProps {
    /** Filters the visited cursors belong to; changing them clears the stack. */
    filterSignature: string;
    /** Cursor the current page was sent with (null on the first page). */
    cursor: string | null;
    /** Offset the current page was sent with; display base of its rows. */
    offset: number;
    /** Rows currently displayed. */
    count: number;
    /** Total rows matching the filters (S3). */
    total: number;
    /** Continuation token from the envelope; null on the last page. */
    nextCursor: string | null;
    onNavigate: (page: { cursor: string | null; offset: number }) => void;
}

/**
 * Prev/Next control for cursor envelopes (S1): Previous walks back through
 * the visited cursors, Next follows the API's `next_cursor`. The visited
 * stack is bound to `filterSignature`, so a filter change clears the cursor
 * state and leaves Previous disabled.
 */
const CursorPagination: React.FC<CursorPaginationProps> = ({
    filterSignature,
    cursor,
    offset,
    count,
    total,
    nextCursor,
    onNavigate,
}) => {
    const [nav, setNav] = useState<CursorNavState>(() => initialCursorNav(filterSignature));
    const stack = activeCursorStack(nav, filterSignature);

    const canPrevious = stack.length > 0;
    const canNext = nextCursor !== null;

    const goPrevious = () => {
        const { nav: previousNav, target } = popCursorEntry(nav, filterSignature);
        setNav(previousNav);
        if (target) onNavigate({ cursor: target.cursor, offset: target.offset });
    };

    const goNext = () => {
        if (!nextCursor) return;
        setNav(pushCursorEntry(nav, filterSignature, { cursor, offset }));
        onNavigate({ cursor: nextCursor, offset: offset + count });
    };

    if (count <= 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-4">
            <RecordsCounter offset={offset} count={count} total={total} />
            <Pagination className="w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious isActive={canPrevious} onClick={goPrevious} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext isActive={canNext} onClick={goNext} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default CursorPagination;

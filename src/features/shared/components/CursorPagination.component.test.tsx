import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import CursorPagination from "./CursorPagination.component";
import RecordsCounter from "./RecordsCounter.component";

/** Server-render smoke checks: no DOM harness exists in this repo (see T6). */
describe("RecordsCounter", () => {
    it("renders the S3 counter label for the rows on screen", () => {
        const html = renderToStaticMarkup(<RecordsCounter offset={10} count={10} total={137} />);
        expect(html).toContain("11–20 de 137 registros");
    });

    it("renders nothing for a page without rows", () => {
        expect(renderToStaticMarkup(<RecordsCounter offset={0} count={0} total={0} />)).toBe("");
    });
});

describe("CursorPagination", () => {
    const base = {
        filterSignature: '["tipo"]',
        offset: 10,
        count: 10,
        total: 137,
    };

    it("shows the counter and both controls on a middle page", () => {
        const html = renderToStaticMarkup(
            <CursorPagination
                {...base}
                cursor="cursor-1"
                nextCursor="cursor-2"
                onNavigate={() => undefined}
            />,
        );
        expect(html).toContain("11–20 de 137 registros");
        expect(html).toContain("Anterior");
        expect(html).toContain("Siguiente");
    });

    it("keeps both controls on the first page (stack empty, next available)", () => {
        const html = renderToStaticMarkup(
            <CursorPagination
                {...base}
                offset={0}
                cursor={null}
                nextCursor="cursor-1"
                onNavigate={() => undefined}
            />,
        );
        expect(html).toContain("1–10 de 137 registros");
        expect(html).toContain("Anterior");
        expect(html).toContain("Siguiente");
    });

    it("renders no pager for an empty result", () => {
        const html = renderToStaticMarkup(
            <CursorPagination
                filterSignature="[]"
                cursor={null}
                offset={0}
                count={0}
                total={0}
                nextCursor={null}
                onNavigate={() => undefined}
            />,
        );
        expect(html).toBe("");
    });
});

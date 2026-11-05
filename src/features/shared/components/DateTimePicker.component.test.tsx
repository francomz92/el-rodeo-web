import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import DateTimePicker from "./DateTimePicker.component";

/** Server-render smoke checks: no DOM harness exists in this repo (see T6). */
describe("DateTimePicker", () => {
    it("renders the date-only trigger in the centralized dd/mm/yyyy format", () => {
        const html = renderToStaticMarkup(<DateTimePicker value={new Date(2026, 10, 4, 12, 0)} />);
        expect(html).toContain("04/11/2026");
    });

    it("renders the datetime trigger in the centralized dd/mm/yyyy, HH:mm format", () => {
        const html = renderToStaticMarkup(
            <DateTimePicker value={new Date(2026, 10, 4, 14, 30)} disableTime={false} />,
        );
        expect(html).toContain("04/11/2026");
        expect(html).toContain("14:30");
    });
});

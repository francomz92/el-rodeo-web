import { describe, expect, it, vi } from "vitest";

import { getApiErrorMessage, notifyApiError } from "../src/features/shared/utils/errors.utils";

const structuralError = (overrides: Record<string, unknown> = {}) => ({
    success: false,
    error: {
        code: "VALIDATION_ERROR",
        message: "No se pudo completar la operación",
        details: [],
        ...overrides,
    },
    timestamp: "2026-10-25T10:00:00Z",
});

describe("getApiErrorMessage", () => {
    it("returns the message of a structural error without field details", () => {
        expect(getApiErrorMessage(structuralError())).toBe("No se pudo completar la operación");
    });

    it("returns undefined when the error carries field-level details", () => {
        const error = structuralError({
            details: [{ field: "name", message: "Requerido" }],
        });

        expect(getApiErrorMessage(error)).toBeUndefined();
    });

    it("returns the fallback when field-level details are present", () => {
        const error = structuralError({
            details: [{ field: "name", message: "Requerido" }],
        });

        expect(getApiErrorMessage(error, "Fallo")).toBe("Fallo");
    });

    it("returns undefined when a structural error has no message", () => {
        expect(getApiErrorMessage(structuralError({ message: undefined }))).toBeUndefined();
    });

    it("returns undefined without a fallback for a non-structural error", () => {
        expect(getApiErrorMessage({ success: true })).toBeUndefined();
    });

    it("returns the fallback for a non-structural error", () => {
        expect(getApiErrorMessage({ success: true }, "Fallo")).toBe("Fallo");
    });

    it("does not throw on a missing error", () => {
        expect(getApiErrorMessage(undefined)).toBeUndefined();
        expect(getApiErrorMessage(null, "Fallo")).toBe("Fallo");
    });

    it("reads the message of a failed payload that has no details array", () => {
        const error = { success: false, error: { message: "Boom" } };

        expect(getApiErrorMessage(error)).toBe("Boom");
    });
});

describe("notifyApiError", () => {
    it("toasts the structural error message exactly once", () => {
        const notifier = { error: vi.fn() };

        notifyApiError(notifier, structuralError());

        expect(notifier.error).toHaveBeenCalledTimes(1);
        expect(notifier.error).toHaveBeenCalledWith("No se pudo completar la operación");
    });

    it("keeps quiet when the error carries field-level details", () => {
        const notifier = { error: vi.fn() };
        const error = structuralError({ details: [{ field: "name", message: "Requerido" }] });

        notifyApiError(notifier, error);

        expect(notifier.error).not.toHaveBeenCalled();
    });

    it("toasts the fallback when there is no toastable message", () => {
        const notifier = { error: vi.fn() };

        notifyApiError(notifier, { success: true }, "Error al exportar su información");

        expect(notifier.error).toHaveBeenCalledTimes(1);
        expect(notifier.error).toHaveBeenCalledWith("Error al exportar su información");
    });

    it("stays quiet when neither a message nor a fallback exists", () => {
        const notifier = { error: vi.fn() };

        notifyApiError(notifier, { success: true });

        expect(notifier.error).not.toHaveBeenCalled();
    });
});

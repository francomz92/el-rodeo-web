import type { ErrorResponseType } from "../schemas/output/responses.schemas";


/** Minimal toast surface required by the shared error helpers. */
export interface ErrorNotifier {
    error: (message: string) => void;
}

/**
 * Resolve the message to surface for a failed API call.
 *
 * Field-level failures belong to the forms (`mapErrors`), so they are suppressed
 * here and `fallback` is returned instead. Structural failures without a message
 * resolve to `fallback` as well, which keeps every caller free of non-null assertions.
 */
export const getApiErrorMessage = (
    error: ErrorResponseType | null | undefined,
    fallback?: string,
): string | undefined => {
    const hasFieldErrors = (error?.error?.details?.length ?? 0) > 0;
    const isStructuralError = error?.success === false && !hasFieldErrors;

    if (isStructuralError && error?.error?.message) return error.error.message;
    return fallback;
};

/**
 * Show exactly one toast for a failed mutation, unless there is nothing to say.
 *
 * @param fallback message used when the error carries no toastable message
 *   (pass one when the mutation has no field-level error handling of its own).
 */
export const notifyApiError = (
    notifier: ErrorNotifier,
    error: ErrorResponseType | null | undefined,
    fallback?: string,
): void => {
    const message = getApiErrorMessage(error, fallback);
    if (message) notifier.error(message);
};

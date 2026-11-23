/**
 * @fileOverview    Defines error-related property names and identifiers used by alert handling.
 * @module          features/alerts
 */

/** Property names inspected on unknown error-like values. */
export const ERROR_PROPERTY_KEYS = {
    DIGEST: "digest",
} as const;

/** Stable Error.name assigned to errors raised by the alerts feature. */
export const ALERT_ERROR_NAME = "AlertError";

/** Error messages for alert-system programming contract violations. */
export const ALERT_CONTEXT_ERRORS = {
    PROVIDER_MISSING: "useAlertContext must be used inside <AlertProvider>.",
} as const;

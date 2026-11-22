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

/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

/**
 * Application-wide alert codes.
 *
 * @remarks     Feature-specific alert codes belong to their owning feature.
 */
export const APP_ALERT_CODES = {
    UNKNOWN_ERROR: "APP_UNKNOWN_ERROR",
    NETWORK_ERROR: "APP_NETWORK_ERROR",
    NOT_FOUND: "APP_NOT_FOUND",
    RATE_LIMITED: "APP_RATE_LIMITED",
    VALIDATION_FAILED: "APP_VALIDATION_FAILED",
} as const;

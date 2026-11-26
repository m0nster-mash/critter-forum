/**
 * @fileOverview    Defines authentication-specific logging messages.
 * @module          features/auth
 */

/**
 * Stable messages used by authentication server-side logging.
 *
 * @remarks     These messages are intended for operational logs, not user-facing alerts.
 */
export const AUTH_LOG_MESSAGES = {
    EMAIL_VERIFICATION_FAILED: "Failed to send email verification.",
} as const;

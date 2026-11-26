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
    VERIFICATION_TOKEN_STATE_FAILED: "Failed to update email verification token state.",
    UNVERIFIED_ACCOUNT_CLEANUP_FAILED: "Failed to clean up expired unverified accounts.",
    UNVERIFIED_ACCOUNT_CLEANUP_COMPLETED: "Expired unverified account cleanup completed.",
} as const;

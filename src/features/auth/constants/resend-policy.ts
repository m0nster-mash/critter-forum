/**
 * @fileOverview    Defines the server-enforced email-verification resend policy.
 * @module          authentication
 */

/** Minimum time between verification-email resend requests. */
export const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;

/** Maximum number of resend requests permitted in one rolling policy window. */
export const VERIFICATION_RESEND_MAX_ATTEMPTS = 5;

/** Fixed 24-hour window used to cap verification-email resend attempts. */
export const VERIFICATION_RESEND_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Lifetime of a generated verification link, in seconds. */
export const VERIFICATION_TOKEN_TTL_SECONDS = 60 * 60;

/** User-facing messages for verification-email resend outcomes. */
export const VERIFICATION_RESEND_MESSAGES = {
    COOLDOWN: "Please wait before requesting another verification email.",
    LIMIT_REACHED: "You've requested the maximum number of verification emails. Please try again later.",
    SEND_FAILED: "We couldn't send the verification email. Please wait a moment and try again.",
    SEND_SUCCESS: "A new verification email has been sent. Check your inbox and spam folder.",
} as const;

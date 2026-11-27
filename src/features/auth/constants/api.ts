/**
 * @fileOverview    Defines the Better Auth API paths and access policy for unverified sessions.
 * @module          authentication
 */

/** Base path mounted by the application's Better Auth catch-all route. */
export const AUTH_API_BASE_PATH = "/api/auth";

/** Better Auth endpoints that an authenticated user may use before verifying their email address. */
export const UNVERIFIED_AUTH_API_ALLOWED_PATHS = [
    "/get-session",
    "/send-verification-email",
    "/sign-out",
    "/verify-email",
] as const;

/** Stable API error returned when an unverified session attempts a restricted Better Auth operation. */
export const AUTH_API_ERRORS = {
    AUTH_REQUIRED: "AUTH_REQUIRED",
    EMAIL_ALREADY_VERIFIED: "EMAIL_ALREADY_VERIFIED",
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
    INVALID_VERIFICATION_TOKEN: "INVALID_VERIFICATION_TOKEN",
    VERIFICATION_RESEND_COOLDOWN: "VERIFICATION_RESEND_COOLDOWN",
    VERIFICATION_RESEND_LIMIT: "VERIFICATION_RESEND_LIMIT",
    CANCEL_REGISTRATION_AUTH_REQUIRED: "CANCEL_REGISTRATION_AUTH_REQUIRED",
    CANCEL_REGISTRATION_FORBIDDEN: "CANCEL_REGISTRATION_FORBIDDEN",
    CANCEL_REGISTRATION_INVALID_REQUEST: "CANCEL_REGISTRATION_INVALID_REQUEST",
    CANCEL_REGISTRATION_INVALID_PASSWORD: "CANCEL_REGISTRATION_INVALID_PASSWORD",
    CANCEL_REGISTRATION_NOT_AVAILABLE: "CANCEL_REGISTRATION_NOT_AVAILABLE",
} as const;

/** User-facing explanation for blocked Better Auth API requests from an unverified session. */
export const AUTH_API_ERROR_MESSAGES = {
    AUTH_REQUIRED: "Sign in to request a verification email.",
    EMAIL_ALREADY_VERIFIED: "This email address has already been verified.",
    EMAIL_NOT_VERIFIED: "Verify your email address before using this feature.",
    INVALID_VERIFICATION_TOKEN: "This verification link has been replaced. Request a new verification email.",
    VERIFICATION_RESEND_COOLDOWN: "Please wait before requesting another verification email.",
    VERIFICATION_RESEND_LIMIT: "You've requested the maximum number of verification emails. Please try again later.",
    CANCEL_REGISTRATION_AUTH_REQUIRED: "Sign in to cancel this registration.",
    CANCEL_REGISTRATION_FORBIDDEN: "This request could not be validated. Refresh the page and try again.",
    CANCEL_REGISTRATION_INVALID_REQUEST: "Enter your password to cancel this registration.",
    CANCEL_REGISTRATION_INVALID_PASSWORD: "The password is incorrect. Your registration has not been cancelled.",
    CANCEL_REGISTRATION_NOT_AVAILABLE: "This registration can no longer be cancelled from this page.",
} as const;

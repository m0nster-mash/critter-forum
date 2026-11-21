/**
 @fileOverview    TODO: document
 @module          features/auth

 @status Requires documentation
 */

import type {AlertDefinition} from "@/features/alerts/types";

/** Stable identifiers for authentication alerts. */
export const AUTH_ALERT_CODES = {
    LOGIN_SUCCESS: "AUTH_LOGIN_SUCCESS",
    LOGIN_INVALID_CREDENTIALS: "AUTH_LOGIN_INVALID_CREDENTIALS",
    LOGIN_FAILED: "AUTH_LOGIN_FAILED",
    RATE_LIMITED: "AUTH_RATE_LIMITED",

    REGISTER_SUCCESS: "AUTH_REGISTER_SUCCESS",
    REGISTER_NAME_REQUIRED: "AUTH_REGISTER_NAME_REQUIRED",
    REGISTER_EMAIL_INVALID: "AUTH_REGISTER_EMAIL_INVALID",
    REGISTER_PASSWORD_TOO_SHORT: "AUTH_REGISTER_PASSWORD_TOO_SHORT",
    REGISTER_EMAIL_TAKEN: "AUTH_REGISTER_EMAIL_TAKEN",
    REGISTER_FAILED: "AUTH_REGISTER_FAILED",
    REGISTER_SIGN_IN_FAILED: "AUTH_REGISTER_SIGN_IN_FAILED",

    LOGOUT_SUCCESS: "AUTH_LOGOUT_SUCCESS",
    LOGOUT_FAILED: "AUTH_LOGOUT_FAILED",
} as const;

/**
 * Authentication alert definitions.
 *
 * @remarks     This registry owns the user-facing message, presentation and logging policy for auth outcomes.
 * @remarks     Sign-in requests go directly from the browser to Better Auth; their server-side logging is handled by
 *              the Better Auth logger configured in `lib/db/auth/auth.ts`.
 */
export const AUTH_ALERTS = {
    AUTH_LOGIN_SUCCESS: {
        severity: "success",
        message: "You're signed in.",
        presentation: "toast",
        log: {server: false, client: false},
    },
    AUTH_LOGIN_INVALID_CREDENTIALS: {
        severity: "error",
        message: "Invalid email or password.",
        presentation: "inline",
        log: {server: false, client: false},
    },
    AUTH_LOGIN_FAILED: {
        severity: "error",
        message: "We couldn't sign you in. Please try again.",
        presentation: "inline",
        log: {server: false, client: "warn"},
    },
    AUTH_RATE_LIMITED: {
        severity: "warn",
        message: "Too many attempts. Please wait a moment and try again.",
        presentation: "inline",
        log: {server: false, client: "warn"},
    },

    AUTH_REGISTER_SUCCESS: {
        severity: "success",
        message: "Your account has been created.",
        presentation: "toast",
        log: {server: "info", client: false},
    },
    AUTH_REGISTER_NAME_REQUIRED: {
        severity: "warn",
        message: "Please enter a username.",
        presentation: "inline",
        field: "name",
        log: {server: false, client: false},
    },
    AUTH_REGISTER_EMAIL_INVALID: {
        severity: "warn",
        message: "Please enter a valid email address.",
        presentation: "inline",
        field: "email",
        log: {server: false, client: false},
    },
    AUTH_REGISTER_PASSWORD_TOO_SHORT: {
        severity: "warn",
        message: "Password must be at least {min} characters long.",
        presentation: "inline",
        field: "password",
        log: {server: false, client: false},
    },
    AUTH_REGISTER_EMAIL_TAKEN: {
        severity: "error",
        message: "An account with that email already exists.",
        presentation: "inline",
        field: "email",
        log: {server: false, client: false},
    },
    AUTH_REGISTER_FAILED: {
        severity: "error",
        message: "The account could not be created.",
        presentation: "inline",
        log: {server: "error", client: "warn"},
    },
    AUTH_REGISTER_SIGN_IN_FAILED: {
        severity: "warn",
        message: "Your account was created, but we couldn't sign you in automatically. Please sign in.",
        presentation: "toast",
        log: {server: false, client: "warn"},
    },

    AUTH_LOGOUT_SUCCESS: {
        severity: "success",
        message: "You've been signed out.",
        presentation: "toast",
        log: {server: false, client: false},
    },
    AUTH_LOGOUT_FAILED: {
        severity: "error",
        message: "We couldn't sign you out. Please try again.",
        presentation: "toast",
        log: {server: false, client: "error"},
    },
} as const satisfies Record<string, AlertDefinition>;

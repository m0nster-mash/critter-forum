/**
 @fileOverview    Provides the integration functionality used by the application.
 @module          features/auth
 */

import {AlertCode} from "@/features/alerts/registry";

/** better-auth error code -> alert code. Codes not listed here fall back to whatever the caller passes. */
export const AUTH_ERROR_ALERT_CODES: Record<string, AlertCode> = {
    INVALID_EMAIL_OR_PASSWORD: "AUTH_LOGIN_INVALID_CREDENTIALS",
    USER_ALREADY_EXISTS: "AUTH_REGISTER_EMAIL_TAKEN",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "AUTH_REGISTER_EMAIL_TAKEN",
    PASSWORD_TOO_SHORT: "AUTH_REGISTER_PASSWORD_TOO_SHORT",
    INVALID_EMAIL: "AUTH_REGISTER_EMAIL_INVALID",
    VALIDATION_ERROR: "APP_VALIDATION_FAILED",
};


/** Stable identifiers for application authentication actions. */
export const AUTH_ACTION_NAMES = {
    REGISTER: "auth.register",
} as const;

/** HTTP status codes used when interpreting authentication responses. */
export const AUTH_HTTP_STATUS = {
    TOO_MANY_REQUESTS: 429,
} as const;


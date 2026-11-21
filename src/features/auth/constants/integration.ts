/**
 @fileOverview    TODO: document
 @module          features/auth

 @status Requires documentation
 */

/** Error codes returned by Better Auth. Preserve the external spelling and casing. */
export const BETTER_AUTH_ERROR_CODES = {
    INVALID_EMAIL_OR_PASSWORD: "INVALID_EMAIL_OR_PASSWORD",
    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
    PASSWORD_TOO_SHORT: "PASSWORD_TOO_SHORT",
    INVALID_EMAIL: "INVALID_EMAIL",
    VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

/** Stable identifiers for application authentication actions. */
export const AUTH_ACTION_NAMES = {
    REGISTER: "auth.register",
} as const;

/** HTTP status codes used when interpreting authentication responses. */
export const AUTH_HTTP_STATUS = {
    TOO_MANY_REQUESTS: 429,
} as const;

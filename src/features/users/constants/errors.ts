/**
 * @fileOverview    Defines stable authentication error identifiers.
 * @module          features/auth
 *
 * @remarks         Centralizes error codes returned by Better Auth for
 *                  consistent interpretation across application features.
 */

/**
 * Stable identifiers for authentication errors.
 */
export const AUTH_ERROR_CODES = {
    INVALID_PASSWORD: "INVALID_PASSWORD",

    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
} as const;

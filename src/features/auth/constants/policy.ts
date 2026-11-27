/**
 * @fileOverview    Provides the policy functionality used by the application.
 * @module          authentication
 */

/** Minimum password length shared by registration validation and Better Auth configuration. */
export const PASSWORD_MIN_LENGTH = 7;

/** Default resend form */
export const DEFAULT_FROM = "Critter Forum <onboarding@resend.dev>";

/** Encoding types */
export const ENCODING = {
    UTF8: "utf8",
    HEX: "hex"
} as const;

/** Algorithm type */
export const ALGORITHM = "sha256";

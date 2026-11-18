import {PUBLIC_ROUTES} from "@/lib/constants/routes";

/**
 * Minimum character length constraint required for user account passwords.
 */
export const PASSWORD_MIN_LENGTH = 7;

/**
 * Default fallback path used across the application for unauthenticated navigation redirects.
 */
export const REDIRECT = PUBLIC_ROUTES.HOME.path;

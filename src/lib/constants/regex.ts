/**
 * @fileOverview    Defines REGEX terms
 * @module          shared
 */

/** Email pattern matching */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/**
 * Token syntax used to interpolate named parameters into alert messages.
 */
export const ALERT_TEMPLATE_PATTERNS = {
    PARAMETER: /\{(\w+)}/g,
} as const;

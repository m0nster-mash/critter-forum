/**
 * @fileOverview    Defines patterns used to interpolate named values into alert messages.
 * @module          features/alerts
 */

/**
 * Token syntax used to interpolate named parameters into alert messages.
 *
 * @TODO    Migrate into `regex.ts`
 */
export const ALERT_TEMPLATE_PATTERNS = {
    PARAMETER: /\{(\w+)}/g,
} as const;

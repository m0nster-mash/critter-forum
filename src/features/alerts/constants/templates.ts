/**
 * TODO: document
 *
 * @module features/alerts/constants/templates
 * @status Requires documentation
 */

/**
 * Token syntax used to interpolate named parameters into alert messages.
 */
export const ALERT_TEMPLATE_PATTERNS = {
    PARAMETER: /\{(\w+)}/g,
} as const;

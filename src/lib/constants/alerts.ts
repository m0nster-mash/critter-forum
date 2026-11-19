/**
 * Constants shared by alert UI components.
 *
 * Centralizes magic strings so alert banners render consistent roles,
 * live-region settings, IDs, class names, and labels.
 */

/**
 * ARIA `role` applied to alert banners based on severity.
 * Error severity uses `alert`; all other severities use `status`.
 */
export const ALERT_ROLES = {
    ERROR: "alert",
    STATUS: "status",
} as const;

/**
 * `aria-live` value applied to alert banners based on role.
 */
export const ALERT_ARIA_LIVE = {
    ASSERTIVE: "assertive",
    POLITE: "polite",
} as const;

/**
 * Severity that maps to the assertive alert role.
 */
export const ALERT_SEVERITY_ERROR = "error";

/**
 * Prefix for the `id` attribute of field-level alert banners.
 */
export const ALERT_FIELD_ID_PREFIX = "alert-";

/**
 * CSS class names for alert banners.
 */
export const ALERT_BANNER_CLASSES = {
    BASE: "alert-banner",
    SEVERITY_PREFIX: "alert-banner-",
} as const;

/**
 * Label text rendered before an alert reference ID.
 */
export const ALERT_REF_LABEL = "Reference: ";

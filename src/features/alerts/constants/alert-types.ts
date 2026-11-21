/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

/**
 * Canonical alert severities used by alert definitions and public alerts.
 */
export const ALERT_SEVERITIES = ["success", "info", "warn", "error"] as const;
/**
 * TODO: document
 *
 * @status Requires documentation
 */
export type AlertSeverityValue = (typeof ALERT_SEVERITIES)[number];

/**
 * Presentation modes supported by the alert system.
 */
export const ALERT_PRESENTATION_TYPES = {
    TOAST: "toast",
    INLINE: "inline",
    NONE: "none",
} as const;

/**
 * TODO:: document
 */
export const ALERT_PRESENTATIONS = [
    ALERT_PRESENTATION_TYPES.TOAST,
    ALERT_PRESENTATION_TYPES.INLINE,
    ALERT_PRESENTATION_TYPES.NONE,
] as const;

/**
 * Human-readable severity labels, including the canonical severity keys.
 */
export const SEVERITY_LABELS: Record<AlertSeverityValue, string> = {
    success: "Success",
    info: "Information",
    warn: "Warning",
    error: "Error",
};

/**
 * Visual variants supported by alert components.
 **/
export const ALERT_VARIANTS = ["banner", "field", "toast"] as const;
/**
 * TODO: document
 *
 * @status Requires documentation
 */
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

/**
 * TODO:: document
 */
export const VARIANT_TYPES = {
    BANNER: "banner",
    FIELD: "field",
    TOAST: "toast",
} as const;

/**
 * Accessible roles associated with alert severities.
 */
export const ALERT_ROLES = {
    ALERT: "alert",
    STATUS: "status",
} as const;

/**
 * @fileOverview    Defines canonical alert severity, presentation, visual variant, and accessibility constants.
 * @module          features/alerts
 *
 * @remarks         Keep literal unions derived from these constants so registries, reducers, and components cannot
 *                  drift into separate sets of accepted values.
 */

/**
 * Severity values supported by the alert registry and public alert payloads.
 *
 * @remarks     `warn` is the canonical warning key to match the logger level convention used by this project.
 */
export const ALERT_SEVERITIES = ["success", "info", "warn", "error"] as const;

/**
 * Union of supported alert severity values.
 *
 * @remarks     Use for alert data and logic. Do not use visual variants to represent severity.
 */
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

/** @deprecated Use {@link AlertSeverity}; retained for existing imports. */
export type AlertSeverityValue = AlertSeverity;

/**
 * Stable identifiers for alert presentation modes.
 *
 * @remarks     `none` means the alert is not rendered on-page; it may still be logged according to its registry policy.
 */
export const ALERT_PRESENTATION_TYPES = {
    TOAST: "toast",
    INLINE: "inline",
    NONE: "none",
} as const;

/** Ordered list of every supported alert presentation mode. */
export const ALERT_PRESENTATIONS = [
    ALERT_PRESENTATION_TYPES.TOAST,
    ALERT_PRESENTATION_TYPES.INLINE,
    ALERT_PRESENTATION_TYPES.NONE,
] as const;

/** Union of supported alert presentation modes. */
export type AlertPresentation = (typeof ALERT_PRESENTATIONS)[number];

/**
 * Visual variants supported by alert-rendering components.
 *
 * @remarks     Variants control layout only. Severity remains a separate property on `PublicAlert`.
 */
export const ALERT_VARIANTS = ["banner", "field", "toast"] as const;

/** Union of supported alert component variants. */
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

/** Named constants for the visual alert variants. */
export const VARIANT_TYPES = {
    BANNER: "banner",
    FIELD: "field",
    TOAST: "toast",
} as const;

/** Accessible live-region roles associated with alert severity. */
export const ALERT_ROLES = {
    ALERT: "alert",
    STATUS: "status",
} as const;

/** Human-readable labels used by accessible alert UI. */
export const SEVERITY_LABELS: Record<AlertSeverity, string> = {
    success: "Success",
    info: "Information",
    warn: "Warning",
    error: "Error",
};

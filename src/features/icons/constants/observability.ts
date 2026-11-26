/**
 * @fileOverview    Defines scope + alert identifiers and messages for application features.
 * @module          features/alerts
 */

export const ICON_SCOPES = {
    ICON_REGISTRY: "icon.registry",
};

/**
 * Stable identifiers for icon-related alerts.
 */
export const ICON_ALERT_CODES = {
    ICON_NOT_FOUND: "ICON_NOT_FOUND",
} as const;

/**
 * Icon-related alert definitions.
 *
 * @remarks     This registry owns diagnostic messages and logging policy
 *              for icon resolution and fallback behaviour.
 */
export const ICON_ALERTS = {
    ICON_NOT_FOUND: {
        message: (iconName: string, fallback: string) =>
            `[IconRegistry] Icon name "${iconName}" not found in registry. Using fallback "${fallback}".`,
        log: {level: "warn"},
    },
} as const;

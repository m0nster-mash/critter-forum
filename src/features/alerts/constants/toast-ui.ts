/**
 * @fileOverview    Defines accessible labels and keyboard values used by toast controls.
 * @module          features/alerts
 */

import {AlertSeverity} from "@/features/alerts/types";
import {ALERT_ICONS} from "@/features/icons/constants/groups";

/** Accessible labels used by toast components. */
export const TOAST_LABELS = {
    DISMISS_NOTIFICATION: "Dismiss notification",
    NOTIFICATIONS: "Notifications",
} as const;

/** Keyboard keys handled by toast components. */
export const TOAST_KEYSTROKE = {
    ESCAPE: "Escape",
} as const;

/**
 * Provides the PATHS functionality.
 **/
export const ICON_PATHS: Record<AlertSeverity, string> = {
    success: ALERT_ICONS.SUCCESS,
    info: ALERT_ICONS.INFO,
    warn: ALERT_ICONS.WARN,
    error: ALERT_ICONS.ERROR,
} as const;

/**
 * @fileOverview    Defines toast stack limits and severity-based dismissal durations.
 * @module          features/alerts
 */

import type {AlertSeverity} from "@/features/alerts/types";

/** Maximum number of simultaneously visible toasts. The oldest is dropped. */
export const MAX_VISIBLE_TOASTS = 4;

/** Auto-dismiss delay in milliseconds, indexed by alert severity. */
export const TOAST_DURATIONS: Record<AlertSeverity, number> = {
    success: 4000,
    info: 5000,
    warn: 8000,
    error: 12000,
};

/** Toast reducer action discriminants. */
export const TOAST_ACTION_TYPES = {
    ADD: "add",
    DISMISS: "dismiss",
    CLEAR: "clear",
} as const;

/** Prefix used when generating toast IDs. */
export const TOAST_ID_PREFIX = "toast-";

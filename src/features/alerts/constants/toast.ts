import type {AlertSeverity} from "@/features/alerts/types";

/**
 * Maximum number of simultaneously visible toasts.
 * The oldest toast is dropped when this limit is exceeded.
 */
export const MAX_VISIBLE_TOASTS = 4;

/**
 * Toast auto-dismiss durations, in milliseconds, by severity.
 */
export const TOAST_DURATIONS: Record<AlertSeverity, number> = {
    success: 4000,
    info: 5000,
    warn: 8000,
    error: 12000,
};

/**
 * Prefix used when generating toast IDs.
 */
export const TOAST_ID_PREFIX = "toast-";

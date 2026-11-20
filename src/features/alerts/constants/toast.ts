import type {AlertSeverity} from "@/features/alerts/types";

/** Most toasts shown at once. When exceeded, the oldest is dropped. */
export const MAX_VISIBLE_TOASTS = 4;

/** Auto-dismiss delay in milliseconds, by severity. */
export const TOAST_DURATIONS: Record<AlertSeverity, number> = {
    success: 4000,
    info: 5000,
    warn: 8000,
    error: 12000,
};

/** Reducer action discriminants. */
export const TOAST_ACTION_TYPES = {
    ADD: "add",
    DISMISS: "dismiss",
    CLEAR: "clear",
} as const;

/** Prefix for generated toast IDs. */
export const TOAST_ID_PREFIX = "toast-";

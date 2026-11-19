import type {AlertSeverity, PublicAlert} from "@/features/alerts/types";

/**
 * Most toasts shown at once. When exceeded, the oldest is dropped.
 */
export const MAX_VISIBLE_TOASTS = 4;  // TODO:: relocate to const file

/**
 * Auto-dismiss delay in milliseconds, by severity. Failures stay longer so they can be read and the reference noted.
 * Hovering or focusing a toast pauses its timer.
 *
 *  TODO:: relocate to const file
 */
export const TOAST_DURATIONS: Record<AlertSeverity, number> = {
    success: 4000,
    info: 5000,
    warn: 8000,
    error: 12000,
};

/**
 * A toast on screen.
 *
 * TODO:: relocate to types file
 *
 * @property    {string}        id      Stable key for the toast
 * @property    {PublicAlert}   alert   The alert being shown (the latest one, if duplicates were merged)
 * @property    {number}        count   How many identical components this toast represents
 * @property    {number}        version Bumped on every merge, so the toast can restart its timer
 */
export interface ToastItem {
    id: string;
    alert: PublicAlert;
    count: number;
    version: number;
}

// TODO:: relocate to types file
export type ToastAction =
    | { type: "add"; id: string; alert: PublicAlert }
    | { type: "dismiss"; id: string }
    | { type: "clear" };

function isSameAlert(a: PublicAlert, b: PublicAlert): boolean {
    return a.code === b.code && a.message === b.message && a.field === b.field;
}

/**
 * Pure reducer for the toast stack.
 *
 * - `add`: an identical toast (same code, message and field) is merged into the existing one, which bumps its
 *   count and restarts its timer, so a repeating failure doesn't flood the screen. Otherwise the toast is appended
 *   and the stack is capped at `MAX_VISIBLE_TOASTS`.
 * - `dismiss`: removes one toast.
 * - `clear`: removes all toasts.
 */
export function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
    switch (action.type) {
        case "add": { // TODO:: replace magic string with consts
            const existing = state.find((item) => isSameAlert(item.alert, action.alert));
            if (existing) {
                return state.map((item) => item === existing
                    ? {
                        ...item,
                        alert: action.alert,
                        count: item.count + 1,
                        version: item.version + 1
                    }
                    : item);
            }
            return [...state, {
                id: action.id,
                alert: action.alert,
                count: 1, version: 0
            }].slice(-MAX_VISIBLE_TOASTS);
        }
        case "dismiss": // TODO:: replace magic string with consts
            return state.filter((item) => item.id !== action.id);
        case "clear": // TODO:: replace magic string with consts
            return [];
    }
}

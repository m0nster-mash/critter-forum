import {MAX_VISIBLE_TOASTS, TOAST_ACTION_TYPES} from "@/features/alerts/constants/toast";
import type {PublicAlert, ToastAction, ToastItem} from "@/features/alerts/types";

function isSameAlert(a: PublicAlert, b: PublicAlert): boolean {
    return a.code === b.code && a.message === b.message && a.field === b.field;
}

/**
 * Pure reducer for the toast stack.
 *
 * - add: an identical toast is merged, bumping its count and version to restart its timer.
 * - dismiss: removes one toast.
 * - clear: removes all toasts.
 */
export function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
    switch (action.type) {
        case TOAST_ACTION_TYPES.ADD: {
            const existing = state.find((item) => isSameAlert(item.alert, action.alert));
            if (existing) {
                return state.map((item) => item === existing
                    ? {
                        ...item,
                        alert: action.alert,
                        count: item.count + 1,
                        version: item.version + 1,
                    }
                    : item);
            }
            return [...state, {
                id: action.id,
                alert: action.alert,
                count: 1,
                version: 0,
            }].slice(-MAX_VISIBLE_TOASTS);
        }
        case TOAST_ACTION_TYPES.DISMISS:
            return state.filter((item) => item.id !== action.id);
        case TOAST_ACTION_TYPES.CLEAR:
            return [];
    }
}

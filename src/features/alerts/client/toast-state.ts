/**
 * @fileOverview    TODO: document
 *
 * @module features/alerts
 * @status Requires documentation
 */

import {MAX_VISIBLE_TOASTS, TOAST_ACTION_TYPES} from "@/features/alerts/constants/toast";
import type {PublicAlert, ToastAction, ToastItem} from "@/features/alerts/types";

/**
 * @module          `features/alerts`
 * @status          Requires documentation
 * @TODO            Document function
 *
 * @fileOverview    TODO:: document
 *
 * @param           {PublicAlert}   alertA  TODO:: document
 * @param           {PublicAlert}   alertB  TODO:: document
 *
 * @return          {boolean}       TODO:: document
 */
function isSameAlert(
    alertA: PublicAlert,
    alertB: PublicAlert
): boolean {

    return alertA.code === alertB.code
        && alertA.message === alertB.message
        && alertA.field === alertB.field;
}

/**
 * @module          `features/alerts`
 * @status          Requires documentation
 * @TODO            Document function
 *
 * @fileOverview    Pure reducer for the toast stack.
 * @remark          {@code add}         an identical toast is merged, bumping its count and version to restart its timer
 *                  {@code dismiss}     removes one toast
 *                  {@code clear}       removes all toasts
 *
 * @param           {ToastItem[]}   state   TODO:: document
 * @param           {ToastAction}   action  TODO:: document
 *
 * @retun           {ToastItem[]}   TODO:: document
 */
export function toastReducer(
    state: ToastItem[],
    action: ToastAction
): ToastItem[] {

    switch (action.type) {

        // Add Action
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

        // Dismiss Action
        case TOAST_ACTION_TYPES.DISMISS:
            return state.filter((item) => item.id !== action.id);

        // Clear Action
        case TOAST_ACTION_TYPES.CLEAR:
            return [];
    }
}

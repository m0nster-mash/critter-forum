/**
 * @fileOverview    Provides the application-wide alert context functionality.
 * @module          features/alerts
 */

"use client";

import {logClientAlert} from "@/features/alerts/client/log-alert";
import {toastReducer} from "@/features/alerts/client/toast-state";
import {AlertContext, AlertProviderContent} from "@/features/alerts/components/alert-provider-content";
import {ALERT_CONTEXT_ERRORS} from "@/features/alerts/constants/errors";
import {TOAST_ACTION_TYPES, TOAST_ID_PREFIX} from "@/features/alerts/constants/toast";
import type {AlertContextValue, LogContext, PublicAlert} from "@/features/alerts/types";
import React, {createElement, useCallback, useContext, useMemo, useReducer, useRef} from "react";


/**
 * Provides the application alert context and its state management.
 *
 * @remarks     Mount once in the root layout so toasts survive client-side navigation.
 *
 * @param       children        The application content
 *
 * @returns     The alert provider component.
 */
export function AlertProvider({children}: { children: React.ReactNode }) {

    const [toasts, dispatch] = useReducer(toastReducer, []);
    const counter = useRef(0);

    const notify = useCallback((
        alert: PublicAlert,
        detail?: LogContext
    ) => {
        logClientAlert(alert, detail);
        counter.current += 1;

        dispatch({
            type: TOAST_ACTION_TYPES.ADD,
            id: `${TOAST_ID_PREFIX}${counter.current}`,
            alert
        });
    }, []);

    const dismiss = useCallback(
        (id: string) => dispatch({type: TOAST_ACTION_TYPES.DISMISS, id}),
        []
    );

    const clear = useCallback(
        () => dispatch({type: TOAST_ACTION_TYPES.CLEAR}),
        []
    );

    const value = useMemo(
        () => ({toasts, notify, dismiss, clear}),
        [toasts, notify, dismiss, clear]
    );

    // TODO:: fix this -- TS2769: No overload matches this call.
    return createElement(AlertProviderContent, {value}, children);
}

/**
 * Reads the alert context.
 *
 * @remarks     Prefer {@link useAlerts()}; this is the low-level accessor.
 *
 * @returns     The alert context value.
 *
 * @throws      {Error} Throws when called outside an AlertProvider.
 */
export function useAlertContext(): AlertContextValue {
    const context = useContext(AlertContext);

    if (context === null) {
        throw new Error(ALERT_CONTEXT_ERRORS.PROVIDER_MISSING);
    }

    return context;
}

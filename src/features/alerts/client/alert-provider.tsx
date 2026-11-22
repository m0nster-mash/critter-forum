/**
 * @fileOverview    Provides the application-wide alert context and mounts the toast notification viewport.
 * @module          features/alerts
 *
 * @status          Requires refactoring
 * @TODO            Migrate `AlertContextValue` into `types.ts
 * @TODO            Migrate the HTML out of `AlertProvider` and into a component file; turn this tile into a `.ts`
 * @TODO            Replace magic string in `useAlertContext()` and convert to correct error handling method
 */

"use client";

import {GlobalErrorListeners} from "@/features/alerts/client/global-error-listeners";
import {logClientAlert} from "@/features/alerts/client/log-alert";
import {toastReducer} from "@/features/alerts/client/toast-state";
import {ToastViewport} from "@/features/alerts/components/toast-viewport";
import {TOAST_ACTION_TYPES, TOAST_ID_PREFIX} from "@/features/alerts/constants/toast";
import type {LogContext, PublicAlert, ToastItem} from "@/features/alerts/types";
import {createContext, type JSX, type ReactNode, useCallback, useContext, useMemo, useReducer, useRef} from "react";

/**
 * Values provided by {@link AlertProvider}.
 *
 * @TODO        Relocate to `types.ts`
 *
 * @property    toasts      Toasts currently on screen
 * @property    notify      Shows an alert as a toast and logs it per its registry policy
 * @property    dismiss     Removes one toast by id
 * @property    clear       Removes every toast
 */
export interface AlertContextValue {
    toasts: ToastItem[];
    notify: (alert: PublicAlert, detail?: LogContext) => void;
    dismiss: (id: string) => void;
    clear: () => void;
}

/** Provides the alertContext functionality. */
const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * Provides the alert context provider, the context value type, and the low-level {@code useAlertContext} accessor hook.
 *
 * @remarks     Mount once in the root layout so toasts survive client-side navigation.
 *
 * @TODO        Migrate HTML return content into component and turn this file into a `.ts`
 *
 * @param       children        The application content
 *
 * @returns     {JSX.Element}   The provider with the toast viewport and global error listeners mounted beside the
 *                              children.
 */
export function AlertProvider({children}: { children: ReactNode }): JSX.Element {

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

    const dismiss = useCallback((id: string) => dispatch({type: TOAST_ACTION_TYPES.DISMISS, id}), []);
    const clear = useCallback(() => dispatch({type: TOAST_ACTION_TYPES.CLEAR}), []);
    const value = useMemo(() => (
        {toasts, notify, dismiss, clear}), [toasts, notify, dismiss, clear]);

    // TODO:: migrate into component
    return (
        <AlertContext.Provider value={value}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss}/>
            <GlobalErrorListeners/>
        </AlertContext.Provider>
    );
}

/**
 * Reads the alert context.
 *
 * @remarks     Prefer {@link useAlerts()}; this is the low-level accessor.
 *
 * @TODO        Investigate error handling; determine if this needs to be refactored.
 *
 * @returns     {AlertContextValue}     The context value.
 *
 * @throws      {Error}                 Throws if called outside an AlertProvider (a programmer error).
 */
export function useAlertContext(): AlertContextValue {
    const context = useContext(AlertContext);
    if (!context) {
        // TODO:: replace magic string and (potentially) convert to correct error handling method
        throw new Error("useAlertContext must be used inside <AlertProvider>.");
    }
    return context;
}

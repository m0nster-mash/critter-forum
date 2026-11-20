"use client";

import {ToastViewport} from "@/components/alerts/toast-viewport";
import {GlobalErrorListeners} from "@/lib/alerts/client/global-error-listeners";
import {logClientAlert} from "@/lib/alerts/client/log-alert";
import {type ToastItem, toastReducer} from "@/lib/alerts/client/toast-state";
import type {LogContext, PublicAlert} from "@/lib/alerts/types";
import {createContext, type JSX, type ReactNode, useCallback, useContext, useMemo, useReducer, useRef} from "react";

/**
 * Value provided by AlertProvider.
 *
 * @property    {ToastItem[]}   toasts      Toasts currently on screen
 * @property    {Function}      notify      Shows an alert as a toast and logs it per its registry policy
 * @property    {Function}      dismiss     Removes one toast by id
 * @property    {Function}      clear       Removes every toast
 */
export interface AlertContextValue {
    toasts: ToastItem[];
    notify: (alert: PublicAlert, detail?: LogContext) => void;
    dismiss: (id: string) => void;
    clear: () => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * Owns the toast stack and the notification region. Mount once, in the root layout, so toasts survive client-side
 * navigation (e.g. "Account created" still shows after the redirect to the dashboard).
 *
 * @param   {Object}    props           Component properties
 * @param   {ReactNode} props.children  The application
 *
 * @return  {JSX.Element}   The provider, with the toast viewport and global error listeners mounted beside the children.
 */
export function AlertProvider({children}: { children: ReactNode }): JSX.Element {
    const [toasts, dispatch] = useReducer(toastReducer, []);
    const counter = useRef(0);

    const notify = useCallback((alert: PublicAlert, detail?: LogContext) => {
        logClientAlert(alert, detail);
        counter.current += 1;
        dispatch({type: "add", id: `toast-${counter.current}`, alert});
    }, []);

    const dismiss = useCallback((id: string) => dispatch({type: "dismiss", id}), []);
    const clear = useCallback(() => dispatch({type: "clear"}), []);

    const value = useMemo(() => ({toasts, notify, dismiss, clear}), [toasts, notify, dismiss, clear]);

    return (
        <AlertContext.Provider value={value}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss}/>
            <GlobalErrorListeners/>
        </AlertContext.Provider>
    );
}

/**
 * Reads the alert context. Prefer `useAlerts()`; this is the low-level accessor.
 *
 * @return  {AlertContextValue} The context value.
 *
 * @throws  {Error} Throws if called outside an AlertProvider (a programmer error).
 */
export function useAlertContext(): AlertContextValue {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlertContext must be used inside <AlertProvider>.");
    }
    return context;
}

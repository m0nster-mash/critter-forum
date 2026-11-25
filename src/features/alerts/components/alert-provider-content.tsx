/**
 * @fileOverview    Provides the alert context and renders application-wide alert UI.
 * @module          features/alerts
 */

"use client";

import {GlobalErrorListeners} from "@/features/alerts/client/global-error-listeners";
import {ToastViewport} from "@/features/alerts/components/toast-viewport";
import type {AlertContextValue, AlertProviderContentProps} from "@/features/alerts/types";
import {createContext} from "react";

/** Provides the alert context to application components. */
export const AlertContext = createContext<AlertContextValue | null>(null);

/**
 * Renders the alert context provider, application content, toast viewport, and global error listeners.
 *
 * @param       children        The application content
 * @param       value           The alert context value
 *
 * @returns     The complete alert provider composition.
 */
export function AlertProviderContent({
                                         children,
                                         value
                                     }: AlertProviderContentProps) {

    return (
        <AlertContext.Provider value={value}>
            {children}
            <ToastViewport toasts={value.toasts} onDismiss={value.dismiss}/>
            <GlobalErrorListeners/>
        </AlertContext.Provider>
    );
}

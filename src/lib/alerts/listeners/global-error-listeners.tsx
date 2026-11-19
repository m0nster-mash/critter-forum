"use client";

import {useAlert} from "@/lib/alerts/client/toast-context";
import {
    WINDOW_ERROR_EVENT,
    WINDOW_UNHANDLED_ERROR,
    WINDOW_UNHANDLED_REJECTION,
    WINDOW_UNHANDLED_REJECTION_EVENT
} from "@/lib/alerts/constants/alerts";
import {createAlert} from "@/lib/alerts/create-alert";
import {FALLBACK_ALERT_CODE} from "@/lib/alerts/registry";
import {clientLogger} from "@/lib/types";
import {useEffect} from "react";

/**
 * Logs uncaught browser errors and unhandled promise rejections.
 */
export function GlobalErrorListeners() {
    const {notify} = useAlert();

    useEffect(() => {
        function handleError(event: ErrorEvent) {
            clientLogger.error(WINDOW_UNHANDLED_ERROR, {
                err: event.error,
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
            });

            notify(createAlert(FALLBACK_ALERT_CODE));
        }

        function handleRejection(event: PromiseRejectionEvent) {
            clientLogger.error(WINDOW_UNHANDLED_REJECTION, {
                err: event.reason,
            });

            notify(createAlert(FALLBACK_ALERT_CODE));
        }

        window.addEventListener(WINDOW_ERROR_EVENT, handleError);
        window.addEventListener(WINDOW_UNHANDLED_REJECTION_EVENT, handleRejection);

        return () => {
            window.removeEventListener(WINDOW_ERROR_EVENT, handleError);
            window.removeEventListener(WINDOW_UNHANDLED_REJECTION_EVENT, handleRejection);
        };
    }, [notify]);

    return null;
}

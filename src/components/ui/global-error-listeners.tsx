"use client";

import {clientLogger} from "@/lib/alerts/client/logger";
import {useAlert} from "@/lib/alerts/client/toast-context";
import {createAlert} from "@/lib/alerts/create-alert";
import {useEffect} from "react";

/**
 * Logs uncaught browser errors and unhandled promise rejections.
 *
 * TODO:: convert magic strings into consts
 *
 * @return TODO:: document
 */
export function GlobalErrorListeners() {
    const {notify} = useAlert();

    useEffect(() => {
        function handleError(event: ErrorEvent) {
            clientLogger.error("window.unhandled_error", {
                err: event.error,
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
            });

            notify(createAlert("APP_UNKNOWN_ERROR"));
        }

        function handleRejection(event: PromiseRejectionEvent) {
            clientLogger.error("window.unhandled_rejection", {
                err: event.reason,
            });

            notify(createAlert("APP_UNKNOWN_ERROR"));
        }

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);

        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, [notify]);

    return null;
}

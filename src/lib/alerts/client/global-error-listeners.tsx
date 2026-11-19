"use client";

import {useAlertContext} from "@/lib/alerts/client/alert-provider";
import {createAlert} from "@/lib/alerts/create-alert";
import {useEffect} from "react";

/**
 * Whether a window error is something the user can't act on and the app didn't cause: browser-extension scripts,
 * cross-origin "Script error." noise, and the benign ResizeObserver notification.
 */
function isNoise(event: ErrorEvent): boolean {
    if (/ResizeObserver loop/i.test(event.message)) return true;
    if (event.message === "Script error.") return true;
    return Boolean(event.filename) && !event.filename.startsWith(window.location.origin);
}

/**
 * Catches what React error boundaries can't (errors thrown in event handlers and timers, unhandled promise
 * rejections) and routes them through the same alert system as everything else. Renders nothing.
 *
 * Repeats are merged by the toast stack, so a failing loop can't flood the screen.
 *
 * @return  {null}  Nothing; mounted for its side effects.
 */
export function GlobalErrorListeners(): null {
    const {notify} = useAlertContext();

    useEffect(() => {
        const onError = (event: ErrorEvent) => {
            if (isNoise(event)) return;
            notify(createAlert("APP_UNKNOWN_ERROR"), {err: event.error ?? event.message, scope: "window.error"});
        };
        const onRejection = (event: PromiseRejectionEvent) => {
            notify(createAlert("APP_UNKNOWN_ERROR"), {err: event.reason, scope: "unhandledrejection"});
        };

        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onRejection);
        return () => {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onRejection);
        };
    }, [notify]);

    return null;
}

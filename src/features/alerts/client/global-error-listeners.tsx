"use client";

import {useAlertContext} from "@/features/alerts/client/alert-provider";
import {APP_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {
    BROWSER_ERROR_EVENTS,
    BROWSER_ERROR_MESSAGES,
    BROWSER_ERROR_PATTERNS,
    LOG_SCOPES
} from "@/features/alerts/constants/observability";
import {createAlert} from "@/features/alerts/create-alert";
import {useEffect} from "react";

/**
 * @fileOverview    Determines whether a window error is something the user can't act on and the app didn't cause:
 *                  browser-extension scripts, cross-origin "Script error." noise, and the benign {@link ResizeObserver}
 *                  notification.
 * @module          `features/alerts`
 * @status          Good
 *
 * @param           {ErrorEvent}    event   TODO:: document
 */
function isNoise(event: ErrorEvent): boolean {

    if (BROWSER_ERROR_PATTERNS.RESIZE_OBSERVER_LOOP.test(event.message)) return true;
    if (event.message === BROWSER_ERROR_MESSAGES.SCRIPT_ERROR) return true;

    return Boolean(event.filename) && !event.filename.startsWith(window.location.origin);
}


/**
 * @fileOverview    Mounts global browser error and unhandled rejection listeners that route errors through the alert
 *                  system. Renders nothing; mounted for its side effects.
 * @module          features/alerts/client/global-error-listeners`
 * @status          Good
 *
 * @return  {null}          Nothing; mounted for its side effects.
 */


/**
 * Catches what React error boundaries can't (errors thrown in event handlers and timers, unhandled promise rejections)
 * and routes them through the same alert system as everything else. Renders nothing.
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
            notify(createAlert(APP_ALERT_CODES.UNKNOWN_ERROR), {
                err: event.error ?? event.message,
                scope: LOG_SCOPES.WINDOW_ERROR
            });
        };
        const onRejection = (event: PromiseRejectionEvent) => {
            notify(createAlert(APP_ALERT_CODES.UNKNOWN_ERROR), {
                err: event.reason,
                scope: LOG_SCOPES.UNHANDLED_REJECTION
            });
        };

        window.addEventListener(BROWSER_ERROR_EVENTS.ERROR, onError);
        window.addEventListener(BROWSER_ERROR_EVENTS.UNHANDLED_REJECTION, onRejection);

        return () => {
            window.removeEventListener(BROWSER_ERROR_EVENTS.ERROR, onError);
            window.removeEventListener(BROWSER_ERROR_EVENTS.UNHANDLED_REJECTION, onRejection);
        };
    }, [notify]);

    return null;
}

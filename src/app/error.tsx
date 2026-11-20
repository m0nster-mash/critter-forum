"use client";

import {logClientAlert} from "@/features/alerts/client/log-alert";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {getErrorDigest} from "@/features/alerts/error-digest";
import {type JSX, useEffect, useMemo} from "react";

/**
 *
 * @module          `features/alerts`
 * @status          Requires cleanup
 * @TODO            Replace magic strings with consts
 * @TODO            Investigate `instrumentation.ts` claim; that file does not appear to be in use.
 *
 * @fileOverview    Route-level error boundary: shown inside the root layout when a page throws while rendering.
 * @remarks         The user sees a generic alert with the error's digest as the reference, which matches the server
 *                  log entry written by {@see instrumentation.ts}.
 * @remarks         The error's message and stack are never rendered.
 *
 * @param           {Object}        props           Component properties
 * @param           {unknown}       props.error     The thrown value; not guaranteed to be an Error
 * @param           {() => void}    props.retry     Re-fetches and re-renders the failed segment
 *
 * @return          {JSX.Element}   The error UI.
 */
export default function RouteError({error, retry}: {
    error: unknown;
    retry: () => void
}): JSX.Element {

    const alert = useMemo(
        () => createAlert("APP_UNKNOWN_ERROR", { // TODO:: replace magic string with const.
            presentation: "inline", // TODO:: replace magic string with const.
            ref: getErrorDigest(error)
        }),
        [error],
    );

    useEffect(() => {
        logClientAlert(alert, {
            err: error,
            scope: "route.render_error", // TODO:: replace magic string with const.
        });
    }, [alert, error]);

    return (
        <>
            <AlertBanner alert={alert}/>
            <p>
                {/*TODO:: replace text label with const.*/}
                <button type="button" onClick={() => retry()}>Try again</button>
            </p>
        </>
    );
}

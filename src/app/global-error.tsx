"use client";

import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {logClientAlert} from "@/features/alerts/client/log-alert";
import {APP_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {LOG_SCOPES} from "@/features/alerts/constants/observability";
import {createAlert} from "@/features/alerts/create-alert";
import {getErrorDigest} from "@/features/alerts/error-digest";
import {type JSX, useEffect, useMemo} from "react";

/**
 * @fileOverview            Last-resort error boundary: replaces the root layout when the layout itself throws, so it
 *                          must render its own {@code <html>} and {@code <body>}. Deliberately independent of the root
 *                          layout and AlertProvider, which aren't available here.
 * @module                  `modules/alerts`
 * @status                  Requires cleanup
 *
 * @TODO                    Replace magic strings with consts
 * @TODO                    Remove inline styles
 *
 * @param   {Object}        props           Component properties
 * @param   {unknown}       props.error     The thrown value; not guaranteed to be an Error
 * @param   {() => void}    props.retry     Re-fetches and re-renders the application
 *
 * @return  {JSX.Element}   The error UI.
 */
export default function GlobalError({error, retry}: {
    error: unknown;
    retry: () => void
}): JSX.Element {

    const alert = useMemo(
        () => createAlert(
            "APP_UNKNOWN_ERROR", { // TODO:: replace magic string with const.
                presentation: "inline",  // TODO:: replace magic string with const.
                ref: getErrorDigest(error)
            }),
        [error],
    );

    useEffect(() => {
        logClientAlert(alert, {
            err: error,
            scope: "global.render_error" // TODO:: replace magic string with const.
        });
    }, [alert, error]);

    return (
        <html lang="en">
        {/* TODO:: remove inline styles */}
        <body style={{fontFamily: "Arial, sans-serif", margin: 0, padding: "2rem"}}>
        <AlertBanner alert={alert}/>
        <p>
            <button type="button" onClick={() => retry()}>Try again</button>
        </p>
        </body>
        </html>
    );
}

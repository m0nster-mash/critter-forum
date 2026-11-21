/**
 * @fileOverview    Global error handling boundary
 * @module          features/alerts
 *
 * @status          Requires refactoring
 * @TODO            Relocate this class into its own directory
 * @TODO            Migrate HTML return into its own component file
 * @TODO            Remove inline styling from `GlobalError()`
 */

"use client";

import {logClientAlert} from "@/features/alerts/client/log-alert";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {APP_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {ALERT_PRESENTATION_TYPES} from "@/features/alerts/constants/alert-types";
import {LOG_SCOPES} from "@/features/alerts/constants/observability";
import {createAlert} from "@/features/alerts/create-alert";
import {getErrorDigest} from "@/features/alerts/error-digest";
import {type JSX, useEffect, useMemo} from "react";

/**
 * Last-resort error boundary.
 *
 * @remark      Replaces the root layout when the layout itself throws, so it must render its own {@code <html>} and
 *              {@code <body>}.
 * @remarks     Deliberately independent of the root layout and {@link AlertProvider}, which aren't available here.
 *
 * @TODO        Remove inline styles
 * @TODO        Migrate HTML return into its own component file
 *
 * @param       error           The thrown value; not guaranteed to be an Error
 * @param       retry           Re-fetches and re-renders the application
 *
 * @returns     {JSX.Element}   The error UI.
 */
export default function GlobalError({error, retry}: {
    error: unknown;
    retry: () => void
}): JSX.Element {

    const alert = useMemo(
        () => createAlert(
            APP_ALERT_CODES.UNKNOWN_ERROR, {
                presentation: ALERT_PRESENTATION_TYPES.INLINE,
                ref: getErrorDigest(error),
            }),
        [error],
    );

    useEffect(() => {
        logClientAlert(alert, {
            err: error,
            scope: LOG_SCOPES.GLOBAL_RENDER_ERROR,
        });
    }, [alert, error]);

    // TODO:: migrate this into a component
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

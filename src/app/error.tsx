/**
 * @fileOverview    Route-level error boundary.
 * @module          alerts
 */

"use client";

import {logClientAlert} from "@/features/alerts/client/log-alert";
import ErrorRetryBanner from "@/features/alerts/components/error-retry-banner";
import {APP_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {ALERT_PRESENTATION_TYPES} from "@/features/alerts/constants/alert-types";
import {LOG_SCOPES} from "@/features/alerts/constants/observability";
import {createAlert} from "@/features/alerts/create-alert";
import {getErrorDigest} from "@/features/alerts/error-digest";
import {type JSX, useEffect, useMemo} from "react";

/**
 * Route-level error boundary: shown inside the root layout when a page throws while rendering.
 *
 * @remarks     The user sees a generic alert with the error's digest as the reference, which matches the server log
 *              entry written by {@see instrumentation.ts}.
 * @remarks     The error's message and stack are never rendered.
 *
 * @param       error           The thrown value; not guaranteed to be an Error
 * @param       retry           Re-fetches and re-renders the failed segment
 *
 * @returns     {JSX.Element}   The error UI.
 */
export default function RouteError({error, retry}: {
    error: unknown;
    retry: () => void
}): JSX.Element {

    const alert = useMemo(
        () => createAlert(APP_ALERT_CODES.UNKNOWN_ERROR, {
            presentation: ALERT_PRESENTATION_TYPES.INLINE,
            ref: getErrorDigest(error)
        }),
        [error],
    );

    useEffect(() => {
        logClientAlert(alert, {
            err: error,
            scope: LOG_SCOPES.ROUTE_RENDER_ERROR,
        });
    }, [alert, error]);

    return <ErrorRetryBanner alert={alert} retry={retry}/>;
}

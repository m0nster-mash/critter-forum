/**
 * @fileOverview    Global error handling boundary
 * @module          features/alerts
 */

"use client";

import {logClientAlert} from "@/features/alerts/client/log-alert";
import GlobalErrorDisplay from "@/features/alerts/components/global-error-display";
import {APP_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {ALERT_PRESENTATION_TYPES} from "@/features/alerts/constants/alert-types";
import {LOG_SCOPES} from "@/features/alerts/constants/observability";
import {createAlert} from "@/features/alerts/create-alert";
import {getErrorDigest} from "@/features/alerts/error-digest";
import {type JSX, useEffect, useMemo} from "react";

/**
 * Last-resort error boundary.
 *
 * @remark      Replaces the root layout when the layout itself throws, so it must render its own `<html>` and `<body>`.
 * @remarks     Deliberately independent of the root layout and {@link AlertProvider}, which aren't available here.
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

    return <GlobalErrorDisplay alert={alert} retry={retry}/>;
}

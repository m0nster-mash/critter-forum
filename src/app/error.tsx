"use client";

import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {logClientAlert} from "@/features/alerts/client/log-alert";
import {createAlert} from "@/lib/alerts/create-alert";
import {getErrorDigest} from "@/lib/alerts/error-digest";
import {type JSX, useEffect, useMemo} from "react";

/**
 * Route-level error boundary: shown inside the root layout when a page throws while rendering.
 *
 * The user sees a generic alert with the error's digest as the reference, which matches the server log entry written
 * by `instrumentation.ts`. The error's message and stack are never rendered.
 *
 * @param   {Object}        props           Component properties
 * @param   {unknown}       props.error     The thrown value; not guaranteed to be an Error
 * @param   {() => void}    props.retry     Re-fetches and re-renders the failed segment
 *
 * @return  {JSX.Element}   The error UI.
 */
export default function RouteError({error, retry}: { error: unknown; retry: () => void }): JSX.Element {
    const alert = useMemo(
        () => createAlert("APP_UNKNOWN_ERROR", {presentation: "inline", ref: getErrorDigest(error)}),
        [error],
    );

    useEffect(() => {
        logClientAlert(alert, {err: error, scope: "route.render_error"});
    }, [alert, error]);

    return (
        <>
            <AlertBanner alert={alert}/>
            <p>
                <button type="button" onClick={() => retry()}>Try again</button>
            </p>
        </>
    );
}

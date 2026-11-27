/**
 * @fileOverview    Route-level error boundary UI component.
 * @module          features/alerts
 */

"use client";

import {AlertBanner} from "@/features/alerts/components/alert-banner";
import type {PublicAlert} from "@/features/alerts/types";
import {type JSX} from "react";

/**
 * Displays the {@code AlertBanner} with attached "try again" button.
 *
 * @param       alert           The alert as it crosses the server/client boundary
 * @param       retry           Re-fetches and re-renders the failed segment
 *
 * @returns     {JSX.Element}   The error UI.
 */
export default ({alert, retry}: {
    alert: PublicAlert;
    retry: () => void
}): JSX.Element => (
    <>
        <AlertBanner alert={alert}/>
        <p>
            <button type="button" onClick={() => retry()}>Try again</button>
        </p>
    </>
)

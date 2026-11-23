/**
 * @fileOverview    Global error handling boundary
 * @module          features/alerts
 */

"use client";

import ErrorRetryBanner from "@/features/alerts/components/error-retry-banner";
import style from "@/features/alerts/styles/alerts.module.css";
import {PublicAlert} from "@/features/alerts/types";
import {type JSX} from "react";

/**
 * Last-resort error boundary UI.
 *
 * @param       alert           The alert as it crosses the server/client boundary
 * @param       retry           Re-fetches and re-renders the application
 *
 * @returns     {JSX.Element}   The error UI.
 */
export default ({alert, retry}: {
    alert: PublicAlert;
    retry: () => void
}): JSX.Element => (

    <html lang="en">
    <body className={style.alertDisplay}>
    <ErrorRetryBanner alert={alert} retry={retry}/>
    </body>
    </html>
)

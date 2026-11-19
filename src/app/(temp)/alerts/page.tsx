"use client";

import {AlertBanner} from "@/components/ui/alert-banner";
import {useAlert} from "@/lib/alerts/client/toast-context";
import {clientLogger} from "@/lib/alerts/client/logger";
import {createAlert} from "@/lib/alerts/create-alert";
import {AlertCode} from "@/lib/alerts/registry";
import type {PublicAlert} from "@/lib/alerts/types";
import {JSX, useState} from "react";

/**
 * Manual QA page for the alert and error workflows.
 *
 * Each button triggers a distinct alert or error path so the toast viewport,
 * inline banners, client logger, and global error listeners can be exercised
 * and verified during testing.
 *
 * @return {JSX.Element} The test page JSX element.
 */
export default function AlertTestPage(): JSX.Element {
    const {notify} = useAlert();
    const [inlineError, setInlineError] = useState<PublicAlert | null>(null);
    const [inlineWarning, setInlineWarning] = useState<PublicAlert | null>(null);

    /**
     * Publishes a registered alert as a toast notification.
     *
     * @param {AlertCode} code  The alert registry code to publish
     */
    function publishToast(code: AlertCode): void {
        notify(createAlert(code));
    }

    /**
     * Publishes the rate-limited alert with a dynamic seconds parameter.
     */
    function publishRateLimited(): void {
        notify(createAlert("APP_RATE_LIMITED", {params: {seconds: 5}}));
    }

    /**
     * Renders a field-level inline error banner and clears any inline warning.
     */
    function showInlineError(): void {
        setInlineError(createAlert("AUTH_LOGIN_FAILED", {field: "email", presentation: "inline"}));
        setInlineWarning(null);
    }

    /**
     * Renders a field-level inline warning banner and clears any inline error.
     */
    function showInlineWarning(): void {
        setInlineWarning(createAlert("APP_RATE_LIMITED", {field: "username", presentation: "inline"}));
        setInlineError(null);
    }

    /**
     * Clears all inline banners.
     */
    function clearInline(): void {
        setInlineError(null);
        setInlineWarning(null);
    }

    /**
     * Simulates an uncaught window error through the global error listener.
     */
    function triggerUnhandledError(): void {
        window.dispatchEvent(
            new ErrorEvent("error", {
                message: "Simulated unhandled exception",
            }),
        );
    }

    /**
     * Simulates an unhandled promise rejection through the global error listener.
     */
    function triggerUnhandledRejection(): void {
        window.dispatchEvent(
            new PromiseRejectionEvent("unhandledrejection", {
                promise: Promise.resolve(),
                reason: new Error("Simulated unhandled rejection"),
            }),
        );
    }

    /**
     * Writes a client log entry at the requested level.
     *
     * @param {("debug" | "info" | "warn" | "error")} level  The log level to emit
     */
    function writeClientLog(level: "debug" | "info" | "warn" | "error"): void {
        const message = `Simulated ${level} log entry`;

        if (level === "debug") {
            clientLogger.debug(message);
        } else if (level === "info") {
            clientLogger.info(message);
        } else if (level === "warn") {
            clientLogger.warn(message);
        } else {
            clientLogger.error(message);
        }
    }

    return (
        <main>
            <h1>Alert & Error Workflow Test</h1>
            <p>Click each button to exercise a different alert or error path.</p>

            <section>
                <h2>Toast alerts</h2>
                <div>
                    <button id="toast-success" type="button" onClick={() => publishToast("AUTH_REGISTER_SUCCESS")}>
                        Success toast
                    </button>
                    <button id="toast-error-network" type="button" onClick={() => publishToast("APP_NETWORK_ERROR")}>
                        Error toast (network)
                    </button>
                    <button id="toast-error-unknown" type="button" onClick={() => publishToast("APP_UNKNOWN_ERROR")}>
                        Error toast (unknown)
                    </button>
                    <button id="toast-warning-rate" type="button" onClick={publishRateLimited}>
                        Warning toast (rate limited w/ params)
                    </button>
                    <button id="toast-validation" type="button" onClick={() => publishToast("APP_VALIDATION_FAILED")}>
                        Warning toast (validation)
                    </button>
                </div>
            </section>

            <section>
                <h2>Inline banners</h2>
                <div>
                    <button id="inline-error" type="button" onClick={showInlineError}>
                        Inline error banner (email field)
                    </button>
                    <button id="inline-warning" type="button" onClick={showInlineWarning}>
                        Inline warning banner (username field)
                    </button>
                    <button id="inline-clear" type="button" onClick={clearInline}>
                        Clear inline banners
                    </button>
                </div>
                {inlineError && <AlertBanner alert={inlineError}/>}
                {inlineWarning && <AlertBanner alert={inlineWarning}/>}
            </section>

            <section>
                <h2>Global error listeners</h2>
                <div>
                    <button id="error-unhandled" type="button" onClick={triggerUnhandledError}>
                        Simulated unhandled error
                    </button>
                    <button id="error-rejection" type="button" onClick={triggerUnhandledRejection}>
                        Simulated unhandled rejection
                    </button>
                </div>
                <p>These dispatch synthetic window events handled by GlobalErrorListeners, which logs the event and publishes a fallback toast.</p>
            </section>

            <section>
                <h2>Client logging</h2>
                <div>
                    <button id="log-debug" type="button" onClick={() => writeClientLog("debug")}>
                        Debug log
                    </button>
                    <button id="log-info" type="button" onClick={() => writeClientLog("info")}>
                        Info log
                    </button>
                    <button id="log-warn" type="button" onClick={() => writeClientLog("warn")}>
                        Warn log
                    </button>
                    <button id="log-error" type="button" onClick={() => writeClientLog("error")}>
                        Error log
                    </button>
                </div>
                <p>Entries are written to the browser console according to the configured client alert log level.</p>
            </section>
        </main>
    );
}

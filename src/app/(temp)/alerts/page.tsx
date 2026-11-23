/**
 * @fileOverview    Temp -> Alert and Error Handling test page
 * @module          features/alerts
 */

"use client";

import {useAlerts} from "@/features/alerts/client/use-alerts";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {AlertCode} from "@/features/alerts/registry";
import {AlertOverrides} from "@/features/alerts/types";

/**
 * Manual test page for the alert and error workflows.
 *
 * @remarks     Every button raises a registered alert code (no free-form messages), covering each severity and
 *              presentation, plus the thrown-error / unhandled-rejection paths.
 * @remarks     Must be rendered inside {@link AlertProvider} (mounted by the root layout at `src/app/layout.tsx`),
 *              because {@code useAlerts()} reads alert context.
 */
export default function AlertTestPage() {

    const {present, clear, notify, inline} = useAlerts();

    const raiseToast = (code: AlertCode, overrides?: AlertOverrides): void => {
        notify(createAlert(code, overrides));
    };

    const raiseInline = (code: AlertCode, overrides?: AlertOverrides): void => {
        present(createAlert(code, {...overrides, presentation: "inline"}));
    };

    return (
        <main style={{padding: 24, maxWidth: 800, fontFamily: "system-ui, sans-serif"}}>
            <h1>Alert &amp; Error Workflow Test</h1>
            <p>
                Click a button to trigger an alert type. Toasts appear in the global stack (top-right); inline banners
                render beneath their group. All text comes from the alert registry.
            </p>

            <section style={{marginTop: 24, marginBottom: 32}}>
                <h2>Toasts</h2>
                <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
                    <button type="button" onClick={() => raiseToast("AUTH_LOGIN_SUCCESS")}>
                        Success toast
                    </button>
                    <button type="button" onClick={() => raiseToast("AUTH_LOGIN_SUCCESS", {severity: "info"})}>
                        Info toast (severity override)
                    </button>
                    <button type="button"
                            onClick={() => raiseToast("APP_RATE_LIMITED", {params: {seconds: 30}})}>
                        Warning toast (with params)
                    </button>
                    <button type="button" onClick={() => raiseToast("AUTH_LOGIN_FAILED")}>
                        Error toast
                    </button>
                    <button type="button" onClick={() => raiseToast("APP_NETWORK_ERROR")}>
                        Network error toast
                    </button>
                    <button type="button"
                            onClick={() => raiseToast("APP_UNKNOWN_ERROR", {ref: "ref-abc-123"})}>
                        Error toast with ref
                    </button>
                </div>
            </section>

            <section style={{marginTop: 24, marginBottom: 32}}>
                <h2>Inline banners</h2>
                <p style={{fontSize: 13, color: "#555"}}>
                    One inline alert at a time. Clicking a banner button replaces the current
                    one; &quot;Clear inline&quot; removes it.
                </p>
                <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
                    <button type="button" onClick={() => raiseInline("AUTH_LOGIN_SUCCESS")}>
                        Success banner
                    </button>
                    <button type="button" onClick={() => raiseInline("AUTH_LOGIN_FAILED")}>
                        Error banner
                    </button>
                    <button type="button" onClick={() => raiseInline("AUTH_REGISTER_EMAIL_INVALID")}>
                        Warning banner (field: email)
                    </button>
                    <button type="button" onClick={() => raiseInline("APP_NOT_FOUND")}>
                        Warning banner (not found)
                    </button>
                    <button type="button" onClick={clear}>
                        Clear inline
                    </button>
                </div>
                {inline && (
                    <div style={{marginTop: 12}}>
                        <AlertBanner alert={inline} variant="banner"/>
                    </div>
                )}
            </section>

            <section style={{marginTop: 24, marginBottom: 32}}>
                <h2>Error paths</h2>
                <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
                    <button type="button"
                            onClick={() => {
                                throw new Error("Simulated unhandled error");
                            }}>
                        Throw unhandled error
                    </button>
                    <button type="button"
                            onClick={() => {
                                void Promise.reject(new Error("Simulated unhandled rejection"));
                            }}>
                        Unhandled promise rejection
                    </button>
                    <button type="button"
                            onClick={() => raiseInline("APP_UNKNOWN_ERROR")}>
                        Present unknown-error inline
                    </button>
                </div>
                <p style={{fontSize: 13, color: "#555"}}>
                    Thrown errors and unhandled rejections are handled by the global error listeners and turned into a
                    generic toast. Open the browser console to see the logged output.
                </p>
            </section>
        </main>
    );
}

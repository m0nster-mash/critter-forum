/**
 * @fileOverview    Renders the verification-pending instructions and secure resend control.
 * @module          authentication
 *
 * @TODO            Replace magic strings with consts
 * @TODO            Document functions properly
 * @TODO            Migrate out interfaces
 */

"use client";

import {AUTH_API_ERRORS} from "@/features/auth/constants/api";
import {VERIFICATION_RESEND_MESSAGES} from "@/features/auth/constants/resend-policy";
import {AUTH_FORM_IDS, AUTH_LABELS} from "@/features/auth/constants/ui";
import {authClient} from "@/lib/auth-client";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import {useRouter} from "next/navigation";
import {type FormEvent, useEffect, useState} from "react";

interface VerificationResendPanelProps {
    email: string;
}

/** Reads the resend cooldown carried by the API error response, when the client exposes it. */
function getRetryAfter(error: unknown): number | null {
    if (typeof error !== "object" || error === null) return null;

    const candidate = error as {
        retryAfter?: unknown;
        body?: { retryAfter?: unknown };
        message?: unknown;
    };
    const retryAfter = candidate.retryAfter ?? candidate.body?.retryAfter;

    if (typeof retryAfter === "number" && Number.isFinite(retryAfter)) {
        return Math.max(1, Math.ceil(retryAfter));
    }

    if (typeof candidate.message === "string") {
        const match = candidate.message.match(/retry after (\d+) seconds?/i);
        if (match) return Math.max(1, Number(match[1]));
    }

    return null;
}

/** Renders the verification-pending page's resend interaction. */
export function VerificationResendPanel({email}: VerificationResendPanelProps) {
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [message, setMessage] = useState("");
    const [messageIsError, setMessageIsError] = useState(false);
    const [password, setPassword] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [cancellationMessage, setCancellationMessage] = useState("");
    const [cancellationError, setCancellationError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((remaining) => Math.max(0, remaining - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    async function handleResend() {
        setLoading(true);
        setMessage("");
        setMessageIsError(false);

        try {
            const result = await authClient.sendVerificationEmail({
                email,
                callbackURL: resolvePath(PRIVATE_ROUTES.DASHBOARD),
            });

            if (result.error) {
                const error = result.error as unknown;
                const errorDetails = typeof error === "object" && error !== null
                    ? error as { status?: number; statusCode?: number; code?: string; body?: { code?: string } }
                    : {};
                const code = errorDetails.code ?? errorDetails.body?.code;
                const retryAfter = getRetryAfter(error);

                if ((errorDetails.status ?? errorDetails.statusCode) === 429) {
                    setCooldown(retryAfter ?? 60);
                    const errorMessage = typeof (error as { message?: unknown }).message === "string"
                        ? (error as { message: string }).message.toLowerCase()
                        : "";
                    setMessage(code === AUTH_API_ERRORS.VERIFICATION_RESEND_LIMIT || errorMessage.includes("maximum number")
                        ? VERIFICATION_RESEND_MESSAGES.LIMIT_REACHED
                        : VERIFICATION_RESEND_MESSAGES.COOLDOWN);
                } else {
                    setCooldown(60);
                    setMessage(VERIFICATION_RESEND_MESSAGES.SEND_FAILED);
                }
                setMessageIsError(true);
                return;
            }

            setCooldown(60);
            setMessage(VERIFICATION_RESEND_MESSAGES.SEND_SUCCESS);
        } catch {
            setCooldown(60);
            setMessage(VERIFICATION_RESEND_MESSAGES.SEND_FAILED);
            setMessageIsError(true);
        } finally {
            setLoading(false);
        }
    }

    async function handleCancelRegistration(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCancelling(true);
        setCancellationMessage("");
        setCancellationError(false);

        try {
            const response = await fetch("/api/auth/cancel-registration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({password}),
            });
            const result = await response.json() as { message?: string };

            if (!response.ok) {
                setCancellationMessage(result.message ?? "We couldn't cancel this registration. Please try again.");
                setCancellationError(true);
                return;
            }

            setCancellationMessage(AUTH_LABELS.CANCEL_REGISTRATION_SUCCESS);
            setPassword("");
            // The server has deleted the session. Sign-out clears the now-stale browser cookie when possible.
            try {
                await authClient.signOut();
            } catch {
                // The deleted database session is already invalid even if cookie cleanup cannot complete.
            }
            router.replace(resolvePath(PUBLIC_ROUTES.LOGIN));
            router.refresh();
        } catch {
            setCancellationMessage("We couldn't cancel this registration. Please try again.");
            setCancellationError(true);
        } finally {
            setCancelling(false);
        }
    }

    return (
        <section aria-labelledby={AUTH_FORM_IDS.VERIFY_EMAIL_TITLE}>
            <h1 id={AUTH_FORM_IDS.VERIFY_EMAIL_TITLE}>{AUTH_LABELS.VERIFY_EMAIL_TITLE}</h1>
            <p>Your account has been created. Verify your email address to access Critter Forum.</p>
            <p>We sent a verification link to <strong>{email}</strong>. Check your inbox and spam folder.</p>
            <p>If you haven&apos;t received the message, you can request another one.</p>
            <button type="button" onClick={handleResend} disabled={loading || cooldown > 0}>
                {loading
                    ? AUTH_LABELS.VERIFY_EMAIL_RESENDING
                    : cooldown > 0
                        ? AUTH_LABELS.VERIFY_EMAIL_RESEND_COUNTDOWN.replace("{seconds}", String(cooldown))
                        : AUTH_LABELS.VERIFY_EMAIL_RESEND}
            </button>
            {message && (
                <p role={messageIsError ? "alert" : "status"} aria-live="polite">
                    {message}
                </p>
            )}

            <hr/>
            <div>
                <h2>{AUTH_LABELS.CANCEL_REGISTRATION_TITLE}</h2>
                <p>{AUTH_LABELS.CANCEL_REGISTRATION_DESCRIPTION}</p>
                <form onSubmit={handleCancelRegistration}>
                    <label htmlFor={AUTH_FORM_IDS.CANCEL_REGISTRATION_PASSWORD}>
                        {AUTH_LABELS.CANCEL_REGISTRATION_PASSWORD}
                    </label>
                    <input id={AUTH_FORM_IDS.CANCEL_REGISTRATION_PASSWORD}
                           type="password"
                           autoComplete="current-password"
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                           disabled={cancelling}
                           required/>
                    <button type="submit" disabled={cancelling || password.length === 0}>
                        {cancelling
                            ? AUTH_LABELS.CANCEL_REGISTRATION_PROCESSING
                            : AUTH_LABELS.CANCEL_REGISTRATION_LABEL}
                    </button>
                </form>
                {cancellationMessage && (
                    <p role={cancellationError ? "alert" : "status"} aria-live="polite">
                        {cancellationMessage}
                    </p>
                )}
            </div>
        </section>
    );
}

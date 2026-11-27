/**
 * @fileOverview    Renders the verification-pending instructions and secure resend control.
 * @module          authentication
 *
 * @TODO            Document functions properly
 * @TODO            Swap out FormEvent for something that isn't deprecated
 * @TODO            Swap magic strings for consts
 */

"use client";

import {AUTH_API_ERRORS, AUTH_API_REQUEST, AUTH_API_ROUTES} from "@/features/auth/constants/api";
import {AUTH_ERROR_CODES} from "@/features/auth/constants/errors";
import {AUTH_HTTP_STATUS} from "@/features/auth/constants/integration";
import {VERIFICATION_RESEND_MESSAGES, VERIFICATION_RESEND_UI} from "@/features/auth/constants/resend-policy";
import {AUTH_FORM_IDS, AUTH_INPUT_ATTRIBUTES, AUTH_LABELS} from "@/features/auth/constants/ui";
import type {VerificationResendPanelProps} from "@/features/auth/types";
import {authClient} from "@/lib/auth-client";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import {useRouter} from "next/navigation";
import {type FormEvent, useEffect, useState} from "react";

/**
 * Reads the resend cooldown carried by the API error response, when the client exposes it.
 *
 * @param error  TODO:: document
 */
function getRetryAfter(error: unknown): number | null {
    if (typeof error !== "object" || error === null) return null;

    const candidate = error as {
        retryAfter?: unknown;
        body?: { retryAfter?: unknown };
        message?: unknown;
    };
    const retryAfter = candidate.retryAfter ?? candidate.body?.retryAfter;

    if (typeof retryAfter === "number" && Number.isFinite(retryAfter)) {
        return Math.max(VERIFICATION_RESEND_UI.MINIMUM_RETRY_SECONDS, Math.ceil(retryAfter));
    }

    if (typeof candidate.message === "string") {
        const match = candidate.message.match(VERIFICATION_RESEND_UI.RETRY_AFTER_MESSAGE_PATTERN);

        if (match) {
            return Math.max(
                VERIFICATION_RESEND_UI.MINIMUM_RETRY_SECONDS,
                Number(match[1]),
            );
        }
    }

    return null;
}

/**
 * Renders the verification-pending page's resend interaction.
 *
 * @param email TODO:: document
 */
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
                    ? error as {
                        status?: number;
                        statusCode?: number;
                        code?: string;
                        body?: { code?: string };
                        message?: string;
                    }
                    : {};

                const code = errorDetails.code ?? errorDetails.body?.code;
                const retryAfter = getRetryAfter(error);

                if (
                    (errorDetails.status ?? errorDetails.statusCode) ===
                    AUTH_HTTP_STATUS.TOO_MANY_REQUESTS
                ) {
                    setCooldown(
                        retryAfter ?? VERIFICATION_RESEND_UI.DEFAULT_COOLDOWN_SECONDS,
                    );

                    const errorMessage = errorDetails.message?.toLowerCase() ?? "";

                    setMessage(
                        code === AUTH_API_ERRORS.VERIFICATION_RESEND_LIMIT ||
                        errorMessage.includes(
                            VERIFICATION_RESEND_UI.MAXIMUM_ATTEMPTS_ERROR_FRAGMENT,
                        )
                            ? VERIFICATION_RESEND_MESSAGES.LIMIT_REACHED
                            : VERIFICATION_RESEND_MESSAGES.COOLDOWN,
                    );
                } else {
                    setCooldown(VERIFICATION_RESEND_UI.DEFAULT_COOLDOWN_SECONDS);
                    setMessage(VERIFICATION_RESEND_MESSAGES.SEND_FAILED);
                }

                setMessageIsError(true);
                return;
            }

            setCooldown(VERIFICATION_RESEND_UI.DEFAULT_COOLDOWN_SECONDS);
            setMessage(VERIFICATION_RESEND_MESSAGES.SEND_SUCCESS);
        } catch {
            setCooldown(VERIFICATION_RESEND_UI.DEFAULT_COOLDOWN_SECONDS);
            setMessage(VERIFICATION_RESEND_MESSAGES.SEND_FAILED);
            setMessageIsError(true);
        } finally {
            setLoading(false);
        }
    }

    /**
     * TODO:: document
     * @param event TODO:: document
     */
    async function handleCancelRegistration(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCancelling(true);
        setCancellationMessage("");
        setCancellationError(false);

        try {
            const response = await fetch(AUTH_API_ROUTES.CANCEL_REGISTRATION, {
                method: AUTH_API_REQUEST.POST_METHOD,
                headers: {
                    [AUTH_API_REQUEST.CONTENT_TYPE_HEADER]:
                    AUTH_API_REQUEST.JSON_CONTENT_TYPE,
                },
                body: JSON.stringify({password}),
            });

            const result = await response.json() as { message?: string };

            if (!response.ok) {
                setCancellationMessage(
                    result.message ?? AUTH_ERROR_CODES.REGISTRATION_FAILED,
                );
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
            setCancellationMessage(AUTH_ERROR_CODES.REGISTRATION_FAILED);
            setCancellationError(true);
        } finally {
            setCancelling(false);
        }
    }

    return (
        <>
            <p>{AUTH_LABELS.VERIFY_EMAIL_ACCOUNT_CREATED}</p>

            <p>
                {AUTH_LABELS.VERIFY_EMAIL_SENT_TO_PREFIX}{" "}
                <strong>{email}</strong>.{" "}
                {AUTH_LABELS.VERIFY_EMAIL_SENT_TO_SUFFIX}
            </p>

            <p>{AUTH_LABELS.VERIFY_EMAIL_RESEND_HELP}</p>

            <button type="button"
                    onClick={handleResend}
                    disabled={loading || cooldown > 0}>
                {loading
                    ? AUTH_LABELS.VERIFY_EMAIL_RESENDING
                    : cooldown > 0
                        ? AUTH_LABELS.VERIFY_EMAIL_RESEND_COUNTDOWN.replace(
                            "{seconds}",
                            String(cooldown),
                        )
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
                           type={AUTH_INPUT_ATTRIBUTES.PASSWORD_TYPE}
                           autoComplete={
                               AUTH_INPUT_ATTRIBUTES.CURRENT_PASSWORD_AUTOCOMPLETE
                           }
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                           disabled={cancelling}
                           required/>

                    <button type="submit"
                            disabled={cancelling || password.length === 0}>
                        {cancelling
                            ? AUTH_LABELS.CANCEL_REGISTRATION_PROCESSING
                            : AUTH_LABELS.CANCEL_REGISTRATION_LABEL}
                    </button>
                </form>

                {cancellationMessage && (
                    <p role={cancellationError ? "alert" : "status"}
                       aria-live="polite">
                        {cancellationMessage}
                    </p>
                )}
            </div>
        </>
    );
}

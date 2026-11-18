"use client";

import {AUTH_ALERTS} from "@/features/auth/constants/alerts";
import {AUTH_ERROR_MESSAGES} from "@/features/auth/constants/messages";
import {AUTH_LABELS} from "@/features/auth/constants/ui";
import {signIn} from "@/lib/auth-client";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {AuthFlowProps} from "@/lib/types";
import {resolvePath} from "@/lib/utilities/route-utils";
import {useRouter} from "next/navigation";
import {type SubmitEvent, useState} from "react";

/**
 * TODO:: document
 *
 * @param param0
 * @param param0.onSuccess
 * @constructor
 */
export function LoginPanel({onSuccess}: AuthFlowProps) {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const attemptSignIn = await signIn.email({
                email: email.trim().toLowerCase(),
                password,
            });

            if (attemptSignIn.error) {
                setError(attemptSignIn.error.message || AUTH_ERROR_MESSAGES.LOGIN_FAILED);
            } else {
                if (onSuccess) {
                    onSuccess();
                }
                router.push(resolvePath(PRIVATE_ROUTES.DASHBOARD));
                router.refresh();
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : AUTH_ERROR_MESSAGES.LOGIN_UNKNOWN_ERROR);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div>
                {error && (
                    <p>
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login-email"> Email Address </label>
                        <input id="login-email"
                               type="email"
                               autoComplete="email"
                               placeholder="email@address.com"
                               value={email}
                               onChange={(loginEvent) => setEmail(loginEvent.target.value)}
                               disabled={loading}
                               required/>
                    </div>
                    <div>
                        <label htmlFor="login-password">Password</label>
                        <input id="login-password"
                               type="password"
                               autoComplete="current-password"
                               value={password}
                               onChange={(loginEvent) => setPassword(loginEvent.target.value)}
                               placeholder="••••••••"
                               disabled={loading}
                               required/>
                    </div>
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? AUTH_ALERTS.LOGIN_PROCESSING : AUTH_LABELS.LOGIN_LABEL}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

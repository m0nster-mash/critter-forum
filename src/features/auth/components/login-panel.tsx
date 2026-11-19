"use client";

import {AlertBanner} from "@/components/ui/alert-banner";
import {AUTH_LABELS} from "@/features/auth/constants/ui";
import {AuthFlowProps} from "@/features/auth/types";
import {logClientAlert} from "@/lib/alerts/client/log-alert";
import {createAlert} from "@/lib/alerts/create-alert";
import type {PublicAlert} from "@/lib/alerts/types";
import {signIn} from "@/lib/auth-client";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import {useRouter} from "next/navigation";
import {JSX, type SubmitEvent, useState} from "react";

/**
 * Renders the authentication login form panel.
 *
 * TODO:: convert magic strings into consts
 *
 * @param   {AuthFlowProps} props               Component properties for managing auth flow callbacks
 * @param   {Function}      [props.onSuccess]   Optional callback executed after successful authentication
 *
 * @return  {JSX.Element}                       The login form panel JSX element
 */
export function LoginPanel({onSuccess}: AuthFlowProps): JSX.Element {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<PublicAlert | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(loginEvent: SubmitEvent<HTMLFormElement>) {
        loginEvent.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const attemptSignIn = await signIn.email({
                email: email.trim().toLowerCase(),
                password,
            });

            if (attemptSignIn.error) {
                const alert = createAlert("AUTH_LOGIN_FAILED");
                setError(alert);
                logClientAlert(alert);
            } else {
                onSuccess?.();
                router.push(resolvePath(PRIVATE_ROUTES.DASHBOARD));
                router.refresh();
            }
        } catch (err: unknown) {
            const alert = createAlert("APP_UNKNOWN_ERROR");
            setError(alert);
            logClientAlert(alert, {err});
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {error && <AlertBanner alert={error}/>}

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
                        {loading ? "Logging in..." : AUTH_LABELS.LOGIN_LABEL}
                    </button>
                </div>
            </form>
        </>
    );
}

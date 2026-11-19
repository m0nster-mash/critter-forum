"use client";

import {AlertBanner} from "@/components/alerts/alert-banner";
import {AUTH_LABELS} from "@/features/auth/constants/ui";
import {AuthFlowProps} from "@/features/auth/types";
import {resolveAuthAlertCode} from "@/features/auth/utilities/auth-errors";
import {signIn} from "@/lib/auth-client";
import {useAlerts} from "@/lib/alerts/client/use-alerts";
import {alertFromThrown} from "@/lib/alerts/from-thrown";
import {createAlert} from "@/lib/alerts/create-alert";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import {useRouter} from "next/navigation";
import {JSX, type SubmitEvent, useState} from "react";

/**
 * Renders the authentication login form panel.
 *
 * Failures appear inline above the form; the success confirmation is a toast that survives the redirect.
 *
 * @param   {AuthFlowProps} props               Component properties for managing auth flow callbacks
 * @param   {Function}      [props.onSuccess]   Optional callback executed after successful authentication
 *
 * @return  {JSX.Element}   The login form panel JSX element
 */
export function LoginPanel({onSuccess}: AuthFlowProps): JSX.Element {

    const router = useRouter();
    const {present, clear, formAlert} = useAlerts();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        clear();
        setLoading(true);

        try {
            const attemptSignIn = await signIn.email({
                email: email.trim().toLowerCase(),
                password,
            });

            if (attemptSignIn.error) {
                present(createAlert(resolveAuthAlertCode(attemptSignIn.error, "AUTH_LOGIN_FAILED")));
                return;
            }

            present(createAlert("AUTH_LOGIN_SUCCESS"));
            onSuccess?.();
            router.push(resolvePath(PRIVATE_ROUTES.DASHBOARD));
            router.refresh();
        } catch (err: unknown) {
            present(alertFromThrown(err), {err});
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AlertBanner alert={formAlert}/>
            <form onSubmit={handleSubmit} noValidate>
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
                        {loading ? AUTH_LABELS.LOGIN_PROCESSING : AUTH_LABELS.LOGIN_LABEL}
                    </button>
                </div>
            </form>
        </>
    );
}

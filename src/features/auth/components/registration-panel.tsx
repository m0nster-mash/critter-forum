"use client";

import {AlertBanner} from "@/components/ui/alert-banner";
import {registerAccountAction} from "@/features/auth/actions/register-account-action";
import {AuthFlowProps} from "@/features/auth/types";
import {useAlert} from "@/lib/alerts/client/toast-context";
import {createAlert} from "@/lib/alerts/create-alert";
import type {PublicAlert} from "@/lib/alerts/types";
import {signIn} from "@/lib/auth-client";
import {PASSWORD_MIN_LENGTH} from "@/lib/constants/globals";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {useRouter} from "next/navigation";
import {JSX, type SubmitEvent, useState} from "react";

/**
 * Renders the registration form panel enabling account creation.
 *
 * TODO:: convert magic strings into consts
 *
 * @param   {AuthFlowProps} props               Component properties handling registration callbacks
 * @param   {Function}      [props.onSuccess]   Optional callback function executed upon successful account registration
 *
 * @return  {JSX.Element}                       The registration panel JSX element.
 */
export function RegistrationPanel({onSuccess}: AuthFlowProps): JSX.Element {

    const router = useRouter();
    const {notify} = useAlert();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<PublicAlert | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(registerEvent: SubmitEvent<HTMLFormElement>) {
        registerEvent.preventDefault();
        setError(null);

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName) {
            setError(createAlert("AUTH_REGISTER_INVALID"));
            return;
        }

        if (password.length < PASSWORD_MIN_LENGTH) {
            setError(createAlert("AUTH_REGISTER_INVALID"));
            return;
        }

        setLoading(true);

        try {
            const result = await registerAccountAction({
                name: normalizedName,
                email: normalizedEmail,
                password: password,
            });

            if (!result.ok) {
                setError(result.alert);
                return;
            }

            if (result.alert) {
                notify(result.alert);
            }

            const attemptSignIn = await signIn.email({
                email: normalizedEmail,
                password,
            });

            if (attemptSignIn.error) {
                setError(createAlert("AUTH_REGISTER_SIGN_IN_FAILED"));
                return;
            }

            onSuccess?.();
            router.push(PRIVATE_ROUTES.DASHBOARD.path as string);
            router.refresh();

        } catch {
            setError(createAlert("APP_UNKNOWN_ERROR"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {error && <AlertBanner alert={error}/>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="register-username">Username</label>
                    <input id="register-username"
                           type="text"
                           autoComplete="username"
                           placeholder="Username"
                           value={name}
                           onChange={(registerEvent) => setName(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <label htmlFor="register-email">Email</label>
                    <input id="register-email"
                           type="email"
                           autoComplete="email"
                           placeholder="email@address.com"
                           value={email}
                           onChange={(registerEvent) => setEmail(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <label htmlFor="register-password">Password</label>
                    <input id="register-password"
                           type="password"
                           autoComplete="new-password"
                           placeholder="••••••••"
                           value={password}
                           onChange={(registerEvent) => setPassword(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <button type="submit"
                            disabled={loading}>
                        {loading ? "Creating account..." : "Register Account"}
                    </button>
                </div>
            </form>
        </>
    );
}

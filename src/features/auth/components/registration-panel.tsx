"use client";

import {AlertBanner} from "@/components/alerts/alert-banner";
import {registerAccountAction} from "@/features/auth/actions/register-account-action";
import {AUTH_LABELS} from "@/features/auth/constants/ui";
import {AuthFlowProps} from "@/features/auth/types";
import {validateRegistration} from "@/features/auth/validation";
import {useAlerts} from "@/lib/alerts/client/use-alerts";
import {createAlert} from "@/lib/alerts/create-alert";
import {alertFromThrown} from "@/lib/alerts/from-thrown";
import {signIn} from "@/lib/auth-client";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import {useRouter} from "next/navigation";
import {JSX, type SubmitEvent, useState} from "react";

/**
 * Renders the registration form panel enabling account creation.
 *
 * Validation and server failures appear inline (field-level where the alert names a field, form-level otherwise); the
 * "account created" confirmation is a toast that survives the redirect.
 *
 * @param   {AuthFlowProps} props               Component properties handling registration callbacks
 * @param   {Function}      [props.onSuccess]   Optional callback function executed upon successful account registration
 *
 * @return  {JSX.Element}   The registration panel JSX element.
 */
export function RegistrationPanel({onSuccess}: AuthFlowProps): JSX.Element {

    const router = useRouter();
    const {present, clear, formAlert, fieldAlert} = useAlerts();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const nameAlert = fieldAlert("name");
    const emailAlert = fieldAlert("email");
    const passwordAlert = fieldAlert("password");

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        clear();

        const input = {name: name.trim(), email: email.trim().toLowerCase(), password};

        const invalid = validateRegistration(input);
        if (invalid) {
            present(invalid);
            return;
        }

        setLoading(true);

        try {
            const result = await registerAccountAction(input);
            if (!result.ok) {
                present(result.alert);
                return;
            }

            const attemptSignIn = await signIn.email({email: input.email, password});
            if (attemptSignIn.error) {
                present(createAlert("AUTH_REGISTER_SIGNIN_FAILED"));
                router.push(resolvePath(PUBLIC_ROUTES.LOGIN));
                return;
            }

            present(result.alert ?? createAlert("AUTH_REGISTER_SUCCESS"));
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
                    <label htmlFor="register-username">Username</label>
                    <input id="register-username"
                           type="text"
                           autoComplete="username"
                           placeholder="Username"
                           value={name}
                           onChange={(registerEvent) => setName(registerEvent.target.value)}
                           aria-invalid={nameAlert ? true : undefined}
                           aria-describedby={nameAlert ? "register-username-alert" : undefined}
                           disabled={loading}
                           required/>
                    <AlertBanner alert={nameAlert} id="register-username-alert" variant="field"/>
                </div>
                <div>
                    <label htmlFor="register-email">Email</label>
                    <input id="register-email"
                           type="email"
                           autoComplete="email"
                           placeholder="email@address.com"
                           value={email}
                           onChange={(registerEvent) => setEmail(registerEvent.target.value)}
                           aria-invalid={emailAlert ? true : undefined}
                           aria-describedby={emailAlert ? "register-email-alert" : undefined}
                           disabled={loading}
                           required/>
                    <AlertBanner alert={emailAlert} id="register-email-alert" variant="field"/>
                </div>
                <div>
                    <label htmlFor="register-password">Password</label>
                    <input id="register-password"
                           type="password"
                           autoComplete="new-password"
                           placeholder="••••••••"
                           value={password}
                           onChange={(registerEvent) => setPassword(registerEvent.target.value)}
                           aria-invalid={passwordAlert ? true : undefined}
                           aria-describedby={passwordAlert ? "register-password-alert" : undefined}
                           disabled={loading}
                           required/>
                    <AlertBanner alert={passwordAlert} id="register-password-alert" variant="field"/>
                </div>
                <div>
                    <button type="submit"
                            disabled={loading}>
                        {loading ? AUTH_LABELS.REGISTER_PROCESSING : AUTH_LABELS.REGISTER_LABEL}
                    </button>
                </div>
            </form>
        </>
    );
}

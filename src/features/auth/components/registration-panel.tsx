"use client";

import {AlertBanner} from "@/components/alerts/alert-banner";
import {registerAccountAction} from "@/features/auth/actions/register-account-action";
import {AUTH_FIELDS, AUTH_FORM_IDS} from "@/features/auth/constants/fields";
import {AUTH_LABELS} from "@/features/auth/constants/ui";
import {AuthFlowProps} from "@/features/auth/types";
import {validateRegistration} from "@/features/auth/validation";
import {useAlerts} from "@/lib/alerts/client/use-alerts";
import {AUTH_ALERT_CODES} from "@/lib/alerts/constants/alert-codes";
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

    const nameAlert = fieldAlert(AUTH_FIELDS.NAME);
    const emailAlert = fieldAlert(AUTH_FIELDS.EMAIL);
    const passwordAlert = fieldAlert(AUTH_FIELDS.PASSWORD);

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
                present(createAlert(AUTH_ALERT_CODES.REGISTER_SIGNIN_FAILED));
                router.push(resolvePath(PUBLIC_ROUTES.LOGIN));
                return;
            }

            present(result.alert ?? createAlert(AUTH_ALERT_CODES.REGISTER_SUCCESS));
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
                    <label htmlFor={AUTH_FORM_IDS.REGISTER_NAME}>{AUTH_LABELS.USER_NAME}</label>
                    <input id={AUTH_FORM_IDS.REGISTER_NAME}
                           type="text"
                           autoComplete="username"
                           placeholder="Username"
                           value={name}
                           onChange={(registerEvent) => setName(registerEvent.target.value)}
                           aria-invalid={nameAlert ? true : undefined}
                           aria-describedby={nameAlert ? AUTH_FORM_IDS.REGISTER_ALERT_NAME : undefined}
                           disabled={loading}
                           required/>
                    <AlertBanner alert={nameAlert} id={AUTH_FORM_IDS.REGISTER_ALERT_NAME} variant="field"/>
                </div>
                <div>
                    <label htmlFor={AUTH_FORM_IDS.REGISTER_EMAIL}>{AUTH_LABELS.USER_EMAIL}</label>
                    <input id={AUTH_FORM_IDS.REGISTER_EMAIL}
                           type="email"
                           autoComplete="email"
                           placeholder="email@address.com"
                           value={email}
                           onChange={(registerEvent) => setEmail(registerEvent.target.value)}
                           aria-invalid={emailAlert ? true : undefined}
                           aria-describedby={emailAlert ? AUTH_FORM_IDS.REGISTER_ALERT_EMAIL : undefined}
                           disabled={loading}
                           required/>
                    <AlertBanner alert={emailAlert} id={AUTH_FORM_IDS.REGISTER_ALERT_EMAIL} variant="field"/>
                </div>
                <div>
                    <label htmlFor={AUTH_FORM_IDS.REGISTER_PASSWORD}>{AUTH_LABELS.USER_PASSWORD}</label>
                    <input id={AUTH_FORM_IDS.REGISTER_PASSWORD}
                           type="password"
                           autoComplete="new-password"
                           placeholder="••••••••"
                           value={password}
                           onChange={(registerEvent) => setPassword(registerEvent.target.value)}
                           aria-invalid={passwordAlert ? true : undefined}
                           aria-describedby={passwordAlert ? AUTH_FORM_IDS.REGISTER_ALERT_PASSWORD : undefined}
                           disabled={loading}
                           required/>
                    <AlertBanner alert={passwordAlert} id={AUTH_FORM_IDS.REGISTER_ALERT_PASSWORD} variant="field"/>
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

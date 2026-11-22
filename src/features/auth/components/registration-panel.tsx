/**
 * @fileOverview    Renders the account registration form and handles its submission lifecycle.
 * @module          features/auth
 *
 * @status          Requires documentation
 * @TODO            Fix typing issues on RegistrationPanel
 */

"use client";

import {useAlerts} from "@/features/alerts/client/use-alerts";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {alertFromThrown} from "@/features/alerts/from-thrown";
import {registerAccountAction} from "@/features/auth/actions/register-account-action";
import {AUTH_ALERT_CODES} from "@/features/auth/constants/alerts";
import {AUTH_FIELDS, AUTH_FORM_IDS, AUTH_LABELS} from "@/features/auth/constants/ui";
import {AuthFlowProps} from "@/features/auth/types";
import {validateRegistration} from "@/features/auth/validation";
import {signIn} from "@/lib/auth-client";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import {useRouter} from "next/navigation";
import {JSX, type SubmitEvent, useState} from "react";

/**
 * Renders the registration form panel enabling account creation.
 *
 * @remarks     Validation and server failures appear inline (field-level where the alert names a field, form-level
 *              otherwise); the "account created" confirmation is a toast that survives the redirect.
 *
 * @TODO        Fix type issues:
 *              - TS2339: Property 'present' does not exist on type '{}'.
 *              - TS2339: Property 'clear' does not exist on type '{}'.
 *              - TS2339: Property 'formAlert' does not exist on type '{}'.
 *              - TS2339: Property 'fieldAlert' does not exist on type '{}'.
 *
 * @param       onSuccess       Optional callback function executed upon successful account registration
 *
 * @returns     {JSX.Element}   The registration panel JSX element.
 */
export function RegistrationPanel({onSuccess}: AuthFlowProps): JSX.Element {

    const router = useRouter();
    // TODO:: fix these issues
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
                present(createAlert(AUTH_ALERT_CODES.REGISTER_SIGN_IN_FAILED));
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

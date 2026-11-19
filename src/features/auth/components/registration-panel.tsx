"use client";

import {AlertBanner} from "@/components/ui/alert-banner";
import {registerAccountAction} from "@/features/auth/actions/register-account-action";
import {
    AUTH_ALERT_CODES,
    AUTH_FORM_FIELDS,
    AUTH_LABELS,
    AUTH_UI_TEXT,
    AUTH_USERNAME_PLACEHOLDER
} from "@/features/auth/constants/ui";
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
            setError(createAlert(AUTH_ALERT_CODES.REGISTER_INVALID));
            return;
        }

        if (password.length < PASSWORD_MIN_LENGTH) {
            setError(createAlert(AUTH_ALERT_CODES.REGISTER_INVALID));
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
                setError(createAlert(AUTH_ALERT_CODES.REGISTER_SIGN_IN_FAILED));
                return;
            }

            onSuccess?.();
            router.push(PRIVATE_ROUTES.DASHBOARD.path as string);
            router.refresh();

        } catch {
            setError(createAlert(AUTH_ALERT_CODES.UNKNOWN_ERROR));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {error && <AlertBanner alert={error}/>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor={AUTH_FORM_FIELDS.REGISTER_USERNAME_ID}>{AUTH_LABELS.USERNAME_LABEL}</label>
                    <input id={AUTH_FORM_FIELDS.REGISTER_USERNAME_ID}
                           type="text"
                           autoComplete={AUTH_FORM_FIELDS.USERNAME_AUTOCOMPLETE}
                           placeholder={AUTH_USERNAME_PLACEHOLDER}
                           value={name}
                           onChange={(registerEvent) => setName(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <label htmlFor={AUTH_FORM_FIELDS.REGISTER_EMAIL_ID}>{AUTH_LABELS.EMAIL_LABEL}</label>
                    <input id={AUTH_FORM_FIELDS.REGISTER_EMAIL_ID}
                           type="email"
                           autoComplete={AUTH_FORM_FIELDS.EMAIL_AUTOCOMPLETE}
                           placeholder={AUTH_UI_TEXT.EMAIL_PLACEHOLDER}
                           value={email}
                           onChange={(registerEvent) => setEmail(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <label htmlFor={AUTH_FORM_FIELDS.REGISTER_PASSWORD_ID}>{AUTH_LABELS.PASSWORD_LABEL}</label>
                    <input id={AUTH_FORM_FIELDS.REGISTER_PASSWORD_ID}
                           type="password"
                           autoComplete={AUTH_FORM_FIELDS.NEW_PASSWORD_AUTOCOMPLETE}
                           placeholder={AUTH_UI_TEXT.PASSWORD_PLACEHOLDER}
                           value={password}
                           onChange={(registerEvent) => setPassword(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <button type="submit"
                            disabled={loading}>
                        {loading ? AUTH_UI_TEXT.REGISTER_LOADING : AUTH_UI_TEXT.REGISTER_SUBMIT}
                    </button>
                </div>
            </form>
        </>
    );
}

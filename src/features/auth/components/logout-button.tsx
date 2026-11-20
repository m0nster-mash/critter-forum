"use client";

import {useAlerts} from "@/features/alerts/client/use-alerts";
import {AUTH_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {createAlert} from "@/features/alerts/create-alert";
import {alertFromThrown} from "@/features/alerts/from-thrown";
import {AUTH_LABELS} from "@/features/auth/constants/ui";
import {LogoutButtonProps, LogoutProps} from "@/features/auth/types";
import {signOut} from "@/lib/auth-client";
import {REDIRECT} from "@/lib/constants/globals";
import {useRouter} from "next/navigation";
import {JSX, type MouseEvent, useState} from "react";

/**
 * Renders a stylized button component that triggers user sign-out when clicked.
 *
 * @param   {LogoutButtonProps} props                   Configuration options for the logout button
 * @param   {string}            [props.label="Logout"]  The display text label rendered on the button
 * @param   {string}            [props.redirectTo="/"]  The route path to navigate to after completing logout
 * @param   {Function}          [props.onBeforeLogout]  Optional callback executed immediately before signing out
 *
 * @return  {JSX.Element} The rendered logout button JSX element.
 */
export function LogoutButton({
                                 label = AUTH_LABELS.LOGOUT_LABEL,
                                 redirectTo = REDIRECT,
                                 onBeforeLogout,
                             }: LogoutButtonProps): JSX.Element {
    return (
        <Logout redirectTo={redirectTo} onBeforeLogout={onBeforeLogout}>
            <button type="button">{label}</button>
        </Logout>
    );
}

/**
 * Wrapper component providing click-to-logout handling and session termination logic for child UI elements.
 *
 * @param   {LogoutProps}   props                   Properties controlling the logout execution container
 * @param   {ReactNode}     props.children          Child elements wrapped within the interactive logout container
 * @param   {string}        [props.redirectTo="/"]  The target route to navigate to after sign-out completes
 * @param   {Function}      [props.onSuccess]       Optional callback executed upon successful logout
 * @param   {Function}      [props.onBeforeLogout]  Optional callback executed prior to initiating sign-out
 *
 * @return  {JSX.Element} The interactive container wrapping child elements.
 */
export function Logout({
                           children,
                           redirectTo = REDIRECT,
                           onSuccess,
                           onBeforeLogout,
                       }: LogoutProps): JSX.Element {
    const router = useRouter();
    const {present} = useAlerts();
    const [loading, setLoading] = useState(false);

    const handleLogout = async (event?: MouseEvent<HTMLElement>) => {
        if (event) {
            event.preventDefault();
        }
        if (loading) return;

        setLoading(true);
        try {
            if (onBeforeLogout) {
                await onBeforeLogout();
            }

            const attemptSignOut = await signOut();
            if (attemptSignOut.error) {
                present(createAlert(AUTH_ALERT_CODES.LOGOUT_FAILED));
                setLoading(false);
                return;
            }

            present(createAlert(AUTH_ALERT_CODES.LOGOUT_SUCCESS));
            if (onSuccess) {
                onSuccess();
            }
            router.push(redirectTo);
            router.refresh();
        } catch (err) {
            present(alertFromThrown(err), {err});
            setLoading(false);
        }
    };
    if (children) {
        return (
            <span onClick={handleLogout} role="button" tabIndex={0}>
                {loading ? AUTH_LABELS.LOGOUT_PROCESSING : children}
            </span>
        );
    }

    return (
        <button type="button" onClick={handleLogout} disabled={loading}>
            {loading ? AUTH_LABELS.LOGOUT_PROCESSING : AUTH_LABELS.LOGOUT_LABEL}
        </button>
    );
}

export default LogoutButton;

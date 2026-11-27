/**
 * @fileOverview    Allows users to change their account password.
 * @module          features/users
 */

"use client";

import {useAlerts} from "@/features/alerts/client/use-alerts";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {AUTH_ERROR_CODES} from "@/features/auth/constants/errors";
import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import {readAuthError} from "@/features/auth/utilities/auth-errors";
import {USER_ALERT_CODES, USER_ALERTS} from "@/features/users/constants/alerts";
import {getUserAlertElementId, USER_ELEMENT_IDS} from "@/features/users/constants/elements";
import {USER_FIELDS} from "@/features/users/constants/fields";
import {USER_UI_TEXT} from "@/features/users/constants/ui";
import {validatePasswordChange} from "@/features/users/validation";
import {authClient} from "@/lib/auth-client";
import {JSX, type SubmitEvent, useState} from "react";

/**
 * Renders the current user's password settings.
 *
 * @returns The rendered password settings panel.
 */
export function ManageAccountPasswordPanel(): JSX.Element {

    const alerts = useAlerts();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const currentPasswordAlert = alerts.fieldAlert(USER_FIELDS.CURRENT_PASSWORD);
    const newPasswordAlert = alerts.fieldAlert(USER_FIELDS.NEW_PASSWORD);
    const confirmPasswordAlert = alerts.fieldAlert(USER_FIELDS.CONFIRM_PASSWORD);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        alerts.clear();

        const invalid = validatePasswordChange({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        if (invalid) {
            alerts.present(invalid);
            return;
        }

        setSaving(true);

        try {
            const result = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (result.error) {
                const {code} = readAuthError(result.error);

                alerts.present(
                    createAlert(
                        code === AUTH_ERROR_CODES.INVALID_PASSWORD
                            ? USER_ALERT_CODES.PASSWORD_CURRENT_INVALID
                            : USER_ALERT_CODES.PASSWORD_CHANGE_FAILED,
                    ),
                );
                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            alerts.present(
                createAlert(USER_ALERT_CODES.PASSWORD_CHANGED),
            );

        } catch {
            alerts.present(
                createAlert(USER_ALERT_CODES.PASSWORD_CHANGE_FAILED),
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <section>
            <h2>{USER_UI_TEXT.PASSWORD.TITLE}</h2>

            <p>
                {USER_ALERTS.USER_PASSWORD_TOO_SHORT.message.replace(
                    "{min}",
                    String(PASSWORD_MIN_LENGTH),
                )}
            </p>

            <form onSubmit={handleSubmit} noValidate>
                <AlertBanner alert={alerts.formAlert}/>

                <div>
                    <label htmlFor={USER_ELEMENT_IDS.CURRENT_PASSWORD}>
                        {USER_UI_TEXT.PASSWORD.CURRENT_LABEL}
                    </label>

                    <input id={USER_ELEMENT_IDS.CURRENT_PASSWORD}
                           name={USER_FIELDS.CURRENT_PASSWORD}
                           type="password"
                           autoComplete="current-password"
                           value={currentPassword}
                           onChange={(event) => setCurrentPassword(event.target.value)}
                           aria-invalid={currentPasswordAlert ? true : undefined}
                           aria-describedby={
                               currentPasswordAlert
                                   ? getUserAlertElementId(USER_ELEMENT_IDS.CURRENT_PASSWORD)
                                   : undefined
                           }
                           required/>

                    <AlertBanner alert={currentPasswordAlert}
                                 id={getUserAlertElementId(USER_ELEMENT_IDS.CURRENT_PASSWORD)}
                                 variant="field"/>
                </div>

                <div>
                    <label htmlFor={USER_ELEMENT_IDS.NEW_PASSWORD}>
                        {USER_UI_TEXT.PASSWORD.NEW_LABEL}
                    </label>

                    <input id={USER_ELEMENT_IDS.NEW_PASSWORD}
                           name={USER_FIELDS.NEW_PASSWORD}
                           type="password"
                           autoComplete="new-password"
                           value={newPassword}
                           onChange={(event) => setNewPassword(event.target.value)}
                           aria-invalid={newPasswordAlert ? true : undefined}
                           aria-describedby={
                               newPasswordAlert
                                   ? getUserAlertElementId(USER_ELEMENT_IDS.NEW_PASSWORD)
                                   : undefined
                           } required/>

                    <AlertBanner alert={newPasswordAlert}
                                 id={getUserAlertElementId(USER_ELEMENT_IDS.NEW_PASSWORD)}
                                 variant="field"/>
                </div>

                <div>
                    <label htmlFor={USER_ELEMENT_IDS.CONFIRM_PASSWORD}>
                        {USER_UI_TEXT.PASSWORD.CONFIRM_LABEL}
                    </label>

                    <input id={USER_ELEMENT_IDS.CONFIRM_PASSWORD}
                           name={USER_FIELDS.CONFIRM_PASSWORD}
                           type="password"
                           autoComplete="new-password"
                           value={confirmPassword}
                           onChange={(event) => setConfirmPassword(event.target.value)}
                           aria-invalid={confirmPasswordAlert ? true : undefined}
                           aria-describedby={
                               confirmPasswordAlert
                                   ? getUserAlertElementId(USER_ELEMENT_IDS.CONFIRM_PASSWORD)
                                   : undefined
                           }
                           required/>

                    <AlertBanner alert={confirmPasswordAlert}
                                 id={getUserAlertElementId(USER_ELEMENT_IDS.CONFIRM_PASSWORD)}
                                 variant="field"/>
                </div>

                <button type="submit" disabled={saving}>
                    {saving
                        ? USER_UI_TEXT.PASSWORD.SUBMITTING
                        : USER_UI_TEXT.PASSWORD.SUBMIT}
                </button>
            </form>
        </section>
    );
}

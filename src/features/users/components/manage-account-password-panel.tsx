/**
 * @fileOverview    Allows users to change their account password.
 * @module          features/users
 */

"use client";

import {useAlerts} from "@/features/alerts/client/use-alerts";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import {readAuthError} from "@/features/auth/utilities/auth-errors";
import {USER_ALERT_CODES} from "@/features/users/constants/alerts";
import type {UserSettingsPanelProps} from "@/features/users/types";
import {validatePasswordChange} from "@/features/users/validation";
import {authClient} from "@/lib/auth-client";
import {JSX, type SubmitEvent, useState} from "react";

/**
 * Renders the current user's password settings.
 */
export function ManageAccountPasswordPanel(
    _props: UserSettingsPanelProps,
): JSX.Element {

    const alerts = useAlerts();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const currentPasswordAlert = alerts.fieldAlert("currentPassword");
    const newPasswordAlert = alerts.fieldAlert("newPassword");
    const confirmPasswordAlert = alerts.fieldAlert("confirmPassword");

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
                        code === "INVALID_PASSWORD"
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

        } catch (err: unknown) {
            alerts.present(
                createAlert(USER_ALERT_CODES.PASSWORD_CHANGE_FAILED),
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <section>
            <h2>Change Password</h2>

            <p>
                Your new password must be at least {PASSWORD_MIN_LENGTH} characters long.
            </p>

            <form onSubmit={handleSubmit} noValidate>
                <AlertBanner alert={alerts.formAlert}/>

                <div>
                    <label htmlFor="current-password">Current Password</label>
                    <input id="current-password"
                           name="currentPassword"
                           type="password"
                           autoComplete="current-password"
                           value={currentPassword}
                           onChange={(event) => setCurrentPassword(event.target.value)}
                           aria-invalid={currentPasswordAlert ? true : undefined}
                           aria-describedby={currentPasswordAlert ? "current-password-alert" : undefined}
                           required/>
                    <AlertBanner alert={currentPasswordAlert}
                                 id="current-password-alert"
                                 variant="field"/>
                </div>

                <div>
                    <label htmlFor="new-password">New Password</label>
                    <input id="new-password"
                           name="newPassword"
                           type="password"
                           autoComplete="new-password"
                           value={newPassword}
                           onChange={(event) => setNewPassword(event.target.value)}
                           aria-invalid={newPasswordAlert ? true : undefined}
                           aria-describedby={newPasswordAlert ? "new-password-alert" : undefined}
                           required/>
                    <AlertBanner alert={newPasswordAlert}
                                 id="new-password-alert"
                                 variant="field"/>
                </div>

                <div>
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input id="confirm-password"
                           name="confirmPassword"
                           type="password"
                           autoComplete="new-password"
                           value={confirmPassword}
                           onChange={(event) => setConfirmPassword(event.target.value)}
                           aria-invalid={confirmPasswordAlert ? true : undefined}
                           aria-describedby={confirmPasswordAlert ? "confirm-password-alert" : undefined}
                           required/>
                    <AlertBanner alert={confirmPasswordAlert}
                                 id="confirm-password-alert"
                                 variant="field"/>
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? "Changing..." : "Change Password"}
                </button>
            </form>
        </section>
    );
}

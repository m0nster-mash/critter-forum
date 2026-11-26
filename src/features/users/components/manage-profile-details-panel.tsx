/**
 * @fileOverview    Allows users to update their profile and email address.
 * @module          features/users
 */

"use client";

import {useAlerts} from "@/features/alerts/client/use-alerts";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {readAuthError} from "@/features/auth/utilities/auth-errors";
import {USER_ALERT_CODES} from "@/features/users/constants/alerts";
import {getUserAlertElementId, USER_ELEMENT_IDS} from "@/features/users/constants/elements";
import {AUTH_ERROR_CODES} from "@/features/users/constants/errors";
import {USER_FIELDS} from "@/features/users/constants/fields";
import {USER_UI_TEXT} from "@/features/users/constants/ui";
import type {UserSettingsPanelProps} from "@/features/users/types";
import {validateEmailAddress, validateProfileName} from "@/features/users/validation";
import {authClient} from "@/lib/auth-client";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {useRouter} from "next/navigation";
import {JSX, type SubmitEvent, useEffect, useState} from "react";

/**
 * Renders the current user's profile settings.
 *
 * @param user - Current authenticated user's profile information.
 *
 * @returns    The rendered profile settings panel.
 */
export function ManageProfileDetailsPanel(
    {user}: UserSettingsPanelProps,
): JSX.Element {

    const router = useRouter();

    const profileAlerts = useAlerts();
    const emailAlerts = useAlerts();

    const [name, setName] = useState(user.name);
    const [newEmail, setNewEmail] = useState("");
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);

    const [savingName, setSavingName] = useState(false);
    const [requestingEmail, setRequestingEmail] = useState(false);

    const nameAlert = profileAlerts.fieldAlert(USER_FIELDS.NAME);
    const emailAlert = emailAlerts.fieldAlert(USER_FIELDS.EMAIL);

    useEffect(() => {
        setName(user.name);

        if (pendingEmail && user.email === pendingEmail) {
            setPendingEmail(null);
        }
    }, [user.name, user.email, pendingEmail]);

    async function handleNameSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        profileAlerts.clear();

        const normalizedName = name.trim();
        const invalid = validateProfileName(normalizedName);

        if (invalid) {
            profileAlerts.present(invalid);
            return;
        }

        setSavingName(true);

        try {
            const result = await authClient.updateUser({
                name: normalizedName,
            });

            if (result.error) {
                profileAlerts.present(
                    createAlert(USER_ALERT_CODES.PROFILE_UPDATE_FAILED),
                );
                return;
            }

            setName(normalizedName);

            profileAlerts.present(
                createAlert(USER_ALERT_CODES.PROFILE_UPDATED),
            );

            router.refresh();

        } catch {
            profileAlerts.present(
                createAlert(USER_ALERT_CODES.PROFILE_UPDATE_FAILED),
            );
        } finally {
            setSavingName(false);
        }
    }

    async function handleEmailSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        emailAlerts.clear();

        const normalizedEmail = newEmail.trim().toLowerCase();

        const invalid = validateEmailAddress(normalizedEmail);

        if (invalid) {
            emailAlerts.present(invalid);
            return;
        }

        if (normalizedEmail === user.email.toLowerCase()) {
            emailAlerts.present(
                createAlert(USER_ALERT_CODES.EMAIL_UNCHANGED),
            );
            return;
        }

        setRequestingEmail(true);

        try {
            const result = await authClient.changeEmail({
                newEmail: normalizedEmail,
                callbackURL: PRIVATE_ROUTES.SETTINGS.path,
            });

            if (result.error) {
                const {code} = readAuthError(result.error);

                const alertCode = (
                    code === AUTH_ERROR_CODES.USER_ALREADY_EXISTS
                    || code === AUTH_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
                )
                    ? USER_ALERT_CODES.EMAIL_ALREADY_IN_USE
                    : USER_ALERT_CODES.EMAIL_CHANGE_FAILED;

                emailAlerts.present(createAlert(alertCode));
                return;
            }

            setPendingEmail(normalizedEmail);
            setNewEmail("");

            emailAlerts.present(
                createAlert(USER_ALERT_CODES.EMAIL_CHANGE_REQUESTED),
            );

        } catch {
            emailAlerts.present(
                createAlert(USER_ALERT_CODES.EMAIL_CHANGE_FAILED),
            );
        } finally {
            setRequestingEmail(false);
        }
    }

    return (
        <section>
            <h2>{USER_UI_TEXT.PROFILE.TITLE}</h2>

            <form onSubmit={handleNameSubmit} noValidate>
                <AlertBanner alert={profileAlerts.formAlert}/>

                <div>
                    <label htmlFor={USER_ELEMENT_IDS.PROFILE_NAME}>
                        {USER_UI_TEXT.PROFILE.NAME_LABEL}
                    </label>

                    <input
                        id={USER_ELEMENT_IDS.PROFILE_NAME}
                        name={USER_FIELDS.NAME}
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        aria-invalid={nameAlert ? true : undefined}
                        aria-describedby={
                            nameAlert
                                ? getUserAlertElementId(USER_ELEMENT_IDS.PROFILE_NAME)
                                : undefined
                        }
                        required
                    />

                    <AlertBanner
                        alert={nameAlert}
                        id={getUserAlertElementId(USER_ELEMENT_IDS.PROFILE_NAME)}
                        variant="field"
                    />
                </div>

                <button type="submit" disabled={savingName}>
                    {savingName
                        ? USER_UI_TEXT.PROFILE.NAME_SUBMITTING
                        : USER_UI_TEXT.PROFILE.NAME_SUBMIT}
                </button>
            </form>

            <div>
                <h3>{USER_UI_TEXT.EMAIL.TITLE}</h3>

                <p>
                    {USER_UI_TEXT.EMAIL.CURRENT_LABEL}{" "}
                    <strong>{user.email}</strong>
                </p>

                <form onSubmit={handleEmailSubmit} noValidate>
                    <AlertBanner alert={emailAlerts.formAlert}/>

                    <div>
                        <label htmlFor={USER_ELEMENT_IDS.NEW_EMAIL}>
                            {USER_UI_TEXT.EMAIL.NEW_LABEL}
                        </label>

                        <input
                            id={USER_ELEMENT_IDS.NEW_EMAIL}
                            name={USER_FIELDS.EMAIL}
                            type="email"
                            autoComplete="email"
                            placeholder={USER_UI_TEXT.EMAIL.PLACEHOLDER}
                            value={newEmail}
                            onChange={(event) => setNewEmail(event.target.value)}
                            aria-invalid={emailAlert ? true : undefined}
                            aria-describedby={
                                emailAlert
                                    ? getUserAlertElementId(USER_ELEMENT_IDS.NEW_EMAIL)
                                    : undefined
                            }
                            required
                        />

                        <AlertBanner
                            alert={emailAlert}
                            id={getUserAlertElementId(USER_ELEMENT_IDS.NEW_EMAIL)}
                            variant="field"
                        />
                    </div>

                    <button type="submit" disabled={requestingEmail}>
                        {requestingEmail
                            ? USER_UI_TEXT.EMAIL.SUBMITTING
                            : USER_UI_TEXT.EMAIL.SUBMIT}
                    </button>
                </form>

                {pendingEmail && (
                    <p role="status">
                        {USER_UI_TEXT.EMAIL.PENDING_VERIFICATION(pendingEmail)}
                        {" "}
                        {USER_UI_TEXT.EMAIL.PENDING_VERIFICATION_NOTICE}
                    </p>
                )}
            </div>
        </section>
    );
}

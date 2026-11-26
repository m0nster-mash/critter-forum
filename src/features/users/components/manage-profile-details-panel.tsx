/**
 * @fileOverview    Allows users to update their profile and email address.
 * @module          features/users
 * 
 * TODO             Replace magic strings with consts
 */

"use client";

import {useAlerts} from "@/features/alerts/client/use-alerts";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {readAuthError} from "@/features/auth/utilities/auth-errors";
import {USER_ALERT_CODES} from "@/features/users/constants/alerts";
import type {UserSettingsPanelProps} from "@/features/users/types";
import {validateEmailAddress, validateProfileName,} from "@/features/users/validation";
import {authClient} from "@/lib/auth-client";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {useRouter} from "next/navigation";
import {JSX, type SubmitEvent, useEffect, useState} from "react";

/**
 * Renders the current user's profile settings.
 */
export function ManageProfileDetailsPanel({user}: UserSettingsPanelProps): JSX.Element {

    const router = useRouter();

    const profileAlerts = useAlerts();
    const emailAlerts = useAlerts();

    const [name, setName] = useState(user.name);
    const [newEmail, setNewEmail] = useState("");
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);

    const [savingName, setSavingName] = useState(false);
    const [requestingEmail, setRequestingEmail] = useState(false);

    const nameAlert = profileAlerts.fieldAlert("name");
    const emailAlert = emailAlerts.fieldAlert("email");

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

        } catch (err: unknown) {
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
                    code === "USER_ALREADY_EXISTS"
                    || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
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

        } catch (err: unknown) {
            emailAlerts.present(
                createAlert(USER_ALERT_CODES.EMAIL_CHANGE_FAILED),
            );
        } finally {
            setRequestingEmail(false);
        }
    }

    return (
        <section>
            <h2>Profile Details</h2>

            <form onSubmit={handleNameSubmit} noValidate>
                <AlertBanner alert={profileAlerts.formAlert}/>

                <div>
                    <label htmlFor="profile-name">Name</label>
                    <input id="profile-name"
                           name="name"
                           type="text"
                           autoComplete="name"
                           value={name}
                           onChange={(event) => setName(event.target.value)}
                           aria-invalid={nameAlert ? true : undefined}
                           aria-describedby={nameAlert ? "profile-name-alert" : undefined}
                           required/>
                    <AlertBanner alert={nameAlert}
                                 id="profile-name-alert"
                                 variant="field"/>
                </div>

                <button type="submit" disabled={savingName}>
                    {savingName ? "Saving..." : "Update Name"}
                </button>
            </form>

            <div>
                <h3>Email Address</h3>

                <p>Current email: <strong>{user.email}</strong></p>

                <form onSubmit={handleEmailSubmit} noValidate>
                    <AlertBanner alert={emailAlerts.formAlert}/>

                    <div>
                        <label htmlFor="new-email">New Email Address</label>
                        <input id="new-email"
                               name="email"
                               type="email"
                               autoComplete="email"
                               placeholder="you@example.com"
                               value={newEmail}
                               onChange={(event) => setNewEmail(event.target.value)}
                               aria-invalid={emailAlert ? true : undefined}
                               aria-describedby={emailAlert ? "new-email-alert" : undefined}
                               required/>
                        <AlertBanner alert={emailAlert}
                                     id="new-email-alert"
                                     variant="field"/>
                    </div>

                    <button type="submit" disabled={requestingEmail}>
                        {requestingEmail ? "Sending..." : "Change Email"}
                    </button>
                </form>

                {pendingEmail && (
                    <p role="status">
                        A verification link has been requested for{" "}
                        <strong>{pendingEmail}</strong>.
                        Your current email remains active until the new address
                        is verified.
                    </p>
                )}
            </div>
        </section>
    );
}

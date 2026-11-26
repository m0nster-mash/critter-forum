/**
 * @fileOverview    Renders the interactive admin edit-user form.
 * @module          features/admin/user-management
 */

"use client";

import {ADMIN_ALERT_CODES} from "@/features/admin/constants/alerts";
import type {UserEditPageProps} from "@/features/admin/permissions/types";
import {updateUserAction} from "@/features/admin/user-management/actions/update-user-action";
import {ADMIN_LABELS, FIELD_NAMES, USER_FORM_IDS} from "@/features/admin/user-management/constants/ui";
import {validateUserUpdate} from "@/features/admin/user-management/validation";
import {useAlerts} from "@/features/alerts/client/use-alerts";
import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {alertFromThrown} from "@/features/alerts/from-thrown";
import {useRouter} from "next/navigation";
import {JSX, type SubmitEvent, useState} from "react";

/**
 * Displays the AdminEditUserPanel, used by `admin/[userId]/edit`.
 *
 * @param user  The user record being edited.
 *
 * @returns     The interactive edit-user form.
 */
export default function AdminEditUserPanel({user}: UserEditPageProps): JSX.Element {

    const router = useRouter();
    const {present, clear, formAlert, fieldAlert} = useAlerts();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [loading, setLoading] = useState(false);

    const nameAlert = fieldAlert(FIELD_NAMES.NAME);
    const emailAlert = fieldAlert(FIELD_NAMES.EMAIL);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        clear();

        const input = {
            userId: user.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
        };

        const invalid = validateUserUpdate(input);
        if (invalid) {
            present(invalid);
            return;
        }

        setLoading(true);

        try {
            const result = await updateUserAction(input);

            if (!result.ok) {
                present(result.alert);
                return;
            }

            present(
                result.alert ?? createAlert(ADMIN_ALERT_CODES.USER_UPDATED),
            );

            router.refresh();

        } catch (err: unknown) {
            present(alertFromThrown(err), {err});
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <p>User ID: {user.id}</p>

            <AlertBanner alert={formAlert}/>

            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor={USER_FORM_IDS.NAME}>{ADMIN_LABELS.NAME}</label>

                    <input id={USER_FORM_IDS.NAME}
                           type="text"
                           autoComplete="name"
                           value={name}
                           onChange={(event) => setName(event.target.value)}
                           aria-invalid={nameAlert ? true : undefined}
                           aria-describedby={nameAlert ? USER_FORM_IDS.ALERT_NAME : undefined}
                           disabled={loading}
                           required/>

                    <AlertBanner alert={nameAlert}
                                 id={USER_FORM_IDS.ALERT_NAME}
                                 variant="field"/>
                </div>

                <div>
                    <label htmlFor={USER_FORM_IDS.EMAIL}>{ADMIN_LABELS.EMAIL}</label>

                    <input id={USER_FORM_IDS.EMAIL}
                           type="email"
                           autoComplete="email"
                           value={email}
                           onChange={(event) => setEmail(event.target.value)}
                           aria-invalid={emailAlert ? true : undefined}
                           aria-describedby={emailAlert ? USER_FORM_IDS.ALERT_EMAIL : undefined}
                           disabled={loading}
                           required/>

                    <AlertBanner alert={emailAlert}
                                 id={USER_FORM_IDS.ALERT_EMAIL}
                                 variant="field"/>
                </div>

                <div>
                    <button type="submit"
                            disabled={loading}>
                        {loading ? ADMIN_LABELS.SAVING : ADMIN_LABELS.SAVE_CHANGES}
                    </button>
                </div>
            </form>
        </>
    );
}

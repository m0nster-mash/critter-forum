/**
 * @fileOverview    User -> Account Settings
 * @module          features/auth
 */

import {requireAuth} from "@/features/auth/server/session";
import SettingsPageView from "@/features/users/views/settings-page-view";

/**
 * Displays the SettingsPageView.
 */
export default async function SettingsPage() {

    await requireAuth();
    return <SettingsPageView/>;
}

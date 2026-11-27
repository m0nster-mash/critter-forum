/**
 * @fileOverview    User -> Account Settings
 * @module          authentication
 */

import {requireVerifiedAuth} from "@/features/auth/server/session";
import SettingsPageView from "@/features/users/views/settings-page-view";

/**
 * Displays the SettingsPageView.
 */
export default async function SettingsPage() {

    await requireVerifiedAuth();

    return <SettingsPageView/>;
}

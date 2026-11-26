/**
 * @fileOverview    Renders the user's settings view
 * @module          core-application
 */

"use client";

import {ManageAccountPasswordPanel} from "@/features/users/components/manage-account-password-panel";
import {ManageProfileDetailsPanel} from "@/features/users/components/manage-profile-details-panel";
import {PageHeader} from "@/components/ui/page-header";
import {useSession} from "@/lib/auth-client";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {JSX} from "react";

/**
 * Renders the protected user's settings page view.
 *
 * @remarks     Requires an authenticated session; unauthenticated users are redirected to the login page while the
 *              session is resolving.
 *
 * @returns     {JSX.Element | null}    The settings view, or null while authentication status is resolving
 */
export default function SettingsPageView(): JSX.Element | null {

    const {data: session, isPending} = useSession();

    if (isPending || !session?.user) {
        return null;
    }

    return (
        <>
            <PageHeader {...getPageHeaderProps(PRIVATE_ROUTES.DASHBOARD)}/>
            <ManageProfileDetailsPanel user={session.user}/>
            <ManageAccountPasswordPanel user={session.user}/>
        </>
    );
}

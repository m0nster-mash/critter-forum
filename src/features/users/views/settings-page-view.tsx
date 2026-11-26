/**
 * @fileOverview    Renders the user's settings view.
 * @module          features/users
 */

"use client";

import {PageHeader} from "@/features/navigation/components/page-header";
import {ManageAccountPasswordPanel} from "@/features/users/components/manage-account-password-panel";
import {ManageProfileDetailsPanel} from "@/features/users/components/manage-profile-details-panel";
import {useSession} from "@/lib/auth-client";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {JSX} from "react";

/**
 * Renders the protected user's settings page view.
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

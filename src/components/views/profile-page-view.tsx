/**
 * @fileOverview    Renders the user profile view
 * @module          core-application
 */

import {ProfilePagePanel} from "@/components/panels/profile-page-panel";
import {PageHeader} from "@/components/ui/page-header";
import {getUserById} from "@/features/admin/user-management/queries/get-user-by-id";
import {requireAuth} from "@/features/auth/server/session";
import type {UserIdParams} from "@/features/admin/permissions/types";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {notFound} from "next/navigation";
import type {JSX} from "react";

/**
 * Renders the protected user profile page.
 *
 * @param userId    ID of the user whose profile is displayed.
 * @returns         The rendered profile page.
 */
export default async function ProfilePageView(
    {userId}: UserIdParams
): Promise<JSX.Element> {

    await requireAuth();

    const [user] = await getUserById({userId});

    if (!user) {
        notFound();
    }

    return (
        <>
            <PageHeader {...getPageHeaderProps(PRIVATE_ROUTES.PROFILE, {userId})}/>
            <ProfilePagePanel user={user}/>
        </>
    );
}

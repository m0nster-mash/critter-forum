/**
 * @fileOverview    Renders the user profile view
 * @module          core-application
 */

import {PageHeader} from "@/components/ui/page-header";
import {ProfilePagePanel} from "@/features/users/components/profile-page-panel";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import type {UserProfileProps} from "@/lib/types";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import type {JSX} from "react";

/**
 * Renders the already-authorized profile summary selected by the route.
 *
 * @param   TODO:: document
 */
export default function ProfilePageView({user}: UserProfileProps): JSX.Element {
    return (
        <>
            <PageHeader {...getPageHeaderProps(PRIVATE_ROUTES.DASHBOARD)}/>
            <ProfilePagePanel user={user}/>
        </>
    );
}

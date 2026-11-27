/**
 * @fileOverview    Renders the user profile view
 * @module          core-application
 */

import {PageHeader} from "@/features/navigation/components/page-header";
import {ProfilePagePanel} from "@/features/users/components/profile-page-panel";
import {UserProfileProps} from "@/features/users/types";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import type {JSX} from "react";

/**
 * Renders the authorized user's profile page, combining the standard page header with the profile panel.
 *
 * @param   user  User whose public/profile details are being displayed.
 *
 * @returns {JSX.Element}   The profile page JSX element.
 */
export default function ProfilePageView({user}: UserProfileProps): JSX.Element {

    return (
        <>
            <PageHeader {...getPageHeaderProps(PRIVATE_ROUTES.PROFILE, {userId: user.id})}/>
            <ProfilePagePanel user={user}/>
        </>
    );
}

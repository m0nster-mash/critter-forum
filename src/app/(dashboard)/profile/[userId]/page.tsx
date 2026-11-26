/**
 * @fileOverview    User -> Profile
 * @module          features/user
 */

import ProfilePageView from "@/features/users/views/profile-page-view";
import {getUserById} from "@/features/admin/user-management/queries/get-user-by-id";
import {requireAuth} from "@/features/auth/server/session";
import type {UserProfilePageProps} from "@/lib/types";
import {notFound} from "next/navigation";

/**
 * Loads the signed-in user's profile and renders the profile view.
 *
 * @param params    TODO:: document
 */
export default async function UserProfilePage({params}: UserProfilePageProps) {
    const session = await requireAuth();
    const {userId} = await params;

    // A private profile route must not expose another user's record.
    if (userId !== session.user.id) notFound();

    const [profile] = await getUserById({userId});
    if (!profile) notFound();

    return <ProfilePageView user={profile}/>;
}

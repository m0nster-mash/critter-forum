/**
 * @fileOverview    User -> Profile
 * @module          features/user
 */

import {getUserById} from "@/features/admin/user-management/queries/get-user-by-id";
import {requireAuth} from "@/features/auth/server/session";
import {UserProfilePageProps} from "@/features/users/types";
import ProfilePageView from "@/features/users/views/profile-page-view";
import {notFound} from "next/navigation";

/**
 * Loads the signed-in user's profile and renders the profile view.
 *
 * @param params    The user's ID, page parameter
 */
export default async function UserProfilePage({params}: UserProfilePageProps) {
    const session = await requireAuth();
    const {userId} = await params;
    if (userId !== session.user.id) notFound();

    const [profile] = await getUserById({userId});
    if (!profile) notFound();

    return <ProfilePageView user={profile}/>;
}

/**
 * @fileOverview    User -> Profile
 * @module          user
 */

import {getUserById} from "@/features/admin/user-management/queries/get-user-by-id";
import {requireVerifiedAuth} from "@/features/auth/server/session";
import {UserProfilePageProps} from "@/features/users/types";
import ProfilePageView from "@/features/users/views/profile-page-view";
import {notFound} from "next/navigation";

/**
 * Loads the signed-in user's profile and renders the profile view.
 *
 * @param params    The user's ID, page parameter
 */
export default async function UserProfilePage({params}: UserProfilePageProps) {
    const profile = await sessionCheck(params);

    return <ProfilePageView user={profile}/>;
}

/**
 * Acquires and checks user permissions before allowing page access.
 *
 * @param       params  User ID for the logged-in user
 *
 * @returns     The use profile if authenticated, otherwise redirects the user to a 404 page.
 */
async function sessionCheck(params: Promise<{ userId: string }>) {
    const session = await requireVerifiedAuth();
    const {userId} = await params;
    if (userId !== session.user.id) notFound();

    const [profile] = await getUserById({userId});
    if (!profile) notFound();
    return profile;
}

/**
 * @fileOverview    User -> Profile
 * @module          features/user
 */

import ProfilePageView from "@/components/views/profile-page-view";

export default async function UserProfilePage({params}: UserProfilePageProps) {

    return <ProfilePageView userId={(await params).userId}/>;
}

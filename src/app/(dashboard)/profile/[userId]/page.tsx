/**
 * @fileOverview    User -> Profile
 * @module          features/user
 */

import ProfilePageView from "@/components/views/profile-page-view";
import {UserProfilePageProps} from "@/lib/types";

export default async function UserProfilePage({params}: UserProfilePageProps) {

    return <ProfilePageView userId={(await params).userId}/>;
}

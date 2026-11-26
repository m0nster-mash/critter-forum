/**
 * @fileOverview    Admin -> Edit User
 * @module          features/admin
 */

import AdminEditUserView from "@/features/admin/user-management/views/admin-edit-user-view";
import {UserProfilePageProps} from "@/lib/types";

/**
 * Loads the administrator's version  of the selected user's account settings page.
 *
 * @param       params   The user's ID, page parameter
 */
export default async function AdminEditUserPage({params}: UserProfilePageProps) {

    return <AdminEditUserView userId={(await params).userId}/>
}

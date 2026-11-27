/**
 * @fileOverview    Admin -> Edit User
 * @module          administraton
 */

import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import AdminEditUserView from "@/features/admin/user-management/views/admin-edit-user-view";
import {UserProfilePageProps} from "@/features/users/types";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Loads the administrator's version  of the selected user's account settings page.
 *
 * @param       params   The user's ID, page parameter
 */
export default async function AdminEditUserPage({params}: UserProfilePageProps) {

    await requirePagePermission(ADMIN_ROUTES.USERS_EDIT.permission);

    return <AdminEditUserView userId={(await params).userId}/>
}

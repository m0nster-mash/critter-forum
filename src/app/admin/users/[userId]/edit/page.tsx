/**
 * @fileOverview    Admin -> Edit User
 * @module          features/admin
 */

import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import {AdminEditUserPageProps} from "@/features/admin/user-management/types";
import AdminEditUserView from "@/features/admin/views/admin-edit-user-view";

/**
 * TODO:: document
 *
 * @param       params   TODO:: document
 * @returns     TODO:: document
 */
export default async function AdminEditUserPage({params}: AdminEditUserPageProps) {

    await requirePagePermission(PERMISSIONS.ADMIN_USERS_EDIT);
    return <AdminEditUserView userId={(await params).userId}/>
}

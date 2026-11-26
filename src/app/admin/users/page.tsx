/**
 * @fileOverview    Admin -> User Management
 * @module          features/admin
 */

import AdminUserManagementView from "@/features/admin/user-management/views/admin-user-management-view";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the UserManagementPage
 */
export default async function UserManagementPage() {

    await requirePagePermission(ADMIN_ROUTES.USERS_ACCESS.permission);
    return <AdminUserManagementView/>;
}

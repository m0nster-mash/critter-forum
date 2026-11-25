/**
 * @fileOverview    Admin -> User Management
 * @module          features/admin
 */

import AdminUserManagementView from "@/features/admin/user-management/views/admin-user-management-view";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the {@link UserManagementPage}
 *
 * @remarks     Requires the permission declared on {@link ADMIN_ROUTES.USERS_ACCESS}.
 */
export default async function UserManagementPage() {

    return <AdminUserManagementView/>;
}

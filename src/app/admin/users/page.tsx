/**
 * @fileOverview    Admin -> User Management
 * @module          features/admin
 */

import AdminUserManagementView from "@/features/admin/user-management/views/admin-user-management-view";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the UserManagementPage
 */
export default async function UserManagementPage() {

    return <AdminUserManagementView/>;
}

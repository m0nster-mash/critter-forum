/**
 * @fileOverview    Admin user management view
 * @module          features/admin/user-management
 */

import {PageHeader} from "@/features/navigation/components/page-header";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import AdminUserManagementPanel from "@/features/admin/user-management/components/admin-user-management-panel";
import {getAllUsers} from "@/features/admin/user-management/queries/get-all-users";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";

/**
 * Displays the {@link AdminUserManagementView}
 */
export default async function AdminUserManagementView() {

    await requirePagePermission(ADMIN_ROUTES.USERS_ACCESS.permission);
    const users = await getAllUsers();

    return (
        <>
            <PageHeader {...getPageHeaderProps(ADMIN_ROUTES.USERS_ACCESS)}/>
            <AdminUserManagementPanel users={users}/>
        </>
    );
}

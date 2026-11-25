/**
 * @fileOverview    Admin dashboard view
 * @module          features/admin
 */

import {PageHeader} from "@/components/ui/page-header";
import AdminUserManagementPanel from "@/features/admin/components/admin-user-management-panel";
import {getAllUsers} from "@/features/admin/permissions/queries/get-all-users";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
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

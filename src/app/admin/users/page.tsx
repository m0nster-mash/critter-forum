/**
 * @fileOverview    Admin -> User Management
 * @module          features/admin
 */

import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the {@link UserManagementPageView}
 *
 * @remarks     Requires the permission declared on {@link ADMIN_ROUTES.USERS}.
 */
export default async function UserManagementPage() {

    await requirePagePermission(ADMIN_ROUTES.USERS.permission);

    return (
        <>
            User management page
            {/*<UserManagementPageView/>*/}
        </>
    );
}

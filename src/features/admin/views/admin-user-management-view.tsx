/**
 * @fileOverview    Admin dashboard view
 * @module          features/admin
 */

import {PageHeader} from "@/components/ui/page-header";
import AdminUserManagementPanel from "@/features/admin/components/admin-user-management-panel";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {asc} from "drizzle-orm";

/**
 * Displays the {@link AdminUserManagementView}
 */
export default async function AdminUserManagementView() {

    await requirePagePermission(ADMIN_ROUTES.USERS.permission);

    const users = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)
        .orderBy(asc(user.name));

    return (
        <>
            <PageHeader {...getPageHeaderProps(ADMIN_ROUTES.USERS)}/>
            <AdminUserManagementPanel users={users}/>
        </>
    );
}

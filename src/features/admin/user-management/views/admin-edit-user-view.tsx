/**
 * @fileOverview    Admin edit user view
 * @module          features/admin/user-management
 */

import {PageHeader} from "@/components/ui/page-header";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import type {AdminEditUserViewProps} from "@/features/admin/permissions/types";
import AdminEditUserPanel from "@/features/admin/user-management/components/admin-edit-user-panel";
import {getUserById} from "@/features/admin/user-management/queries/get-user-by-id";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {notFound} from "next/navigation";

/**
 * Displays the {@link AdminEditUserView}
 */
export default async function AdminEditUserView({userId}: AdminEditUserViewProps) {

    await requirePagePermission(ADMIN_ROUTES.USERS_EDIT.permission);
    const [selectedUser] = await getUserById({userId});
    if (!selectedUser) notFound();

    return (
        <>
            <PageHeader {...getPageHeaderProps(ADMIN_ROUTES.USERS_EDIT, {userId})}/>
            <AdminEditUserPanel user={selectedUser}/>
        </>
    );
}

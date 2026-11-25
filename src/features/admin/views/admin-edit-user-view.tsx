/**
 * @fileOverview    Admin dashboard view
 * @module          features/admin
 */

import {PageHeader} from "@/components/ui/page-header";
import AdminEditUserPanel from "@/features/admin/components/admin-edit-user-panel";
import {getSelectedUser} from "@/features/admin/permissions/queries/get-selected-user";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import {AdminEditUserViewProps} from "@/features/admin/permissions/types";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {notFound} from "next/navigation";

/**
 * Displays the {@link AdminEditUserView}
 */
export default async function AdminEditUserView({userId}: AdminEditUserViewProps) {

    await requirePagePermission(ADMIN_ROUTES.USERS_EDIT.permission);
    const [selectedUser] = await getSelectedUser({userId});
    if (!selectedUser) notFound();

    return (
        <>
            <PageHeader {...getPageHeaderProps(ADMIN_ROUTES.USERS_EDIT)}/>
            <AdminEditUserPanel user={selectedUser}/>
        </>
    );
}

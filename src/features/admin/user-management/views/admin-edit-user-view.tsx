/**
 * @fileOverview    Admin edit user view
 * @module          administration/user-management
 */

import type {AdminEditUserViewProps} from "@/features/admin/permissions/types";
import AdminEditUserPanel from "@/features/admin/user-management/components/admin-edit-user-panel";
import {getUserById} from "@/features/admin/user-management/queries/get-user-by-id";
import {PageHeader} from "@/features/navigation/components/page-header";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {notFound} from "next/navigation";

/**
 * Displays the {@link AdminEditUserView}
 */
export default async function AdminEditUserView({userId}: AdminEditUserViewProps) {

    const [selectedUser] = await getUserById({userId});
    if (!selectedUser) notFound();

    return (
        <>
            <PageHeader {...getPageHeaderProps(ADMIN_ROUTES.USERS_EDIT, {userId})}/>
            <AdminEditUserPanel user={selectedUser}/>
        </>
    );
}

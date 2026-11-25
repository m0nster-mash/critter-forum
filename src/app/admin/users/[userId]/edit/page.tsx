/**
 * @fileOverview    Admin -> Edit User
 * @module          features/admin
 */

import {AdminEditUserPageProps} from "@/features/admin/user-management/types";
import AdminEditUserView from "@/features/admin/views/admin-edit-user-view";

/**
 * TODO:: document
 *
 * @param       params   TODO:: document
 * @returns     TODO:: document
 */
export default async function AdminEditUserPage({params}: AdminEditUserPageProps) {

    return <AdminEditUserView userId={(await params).userId}/>
}

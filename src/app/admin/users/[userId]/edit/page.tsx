/**
 * @fileOverview    Admin -> Edit User
 * @module          features/admin
 */

import AdminEditUserView from "@/features/admin/user-management/views/admin-edit-user-view";

export interface AdminEditUserPageProps {
    params: Promise<{ userId: string }>;
}


/**
 * TODO:: document
 *
 * @param       params   TODO:: document
 * @returns     TODO:: document
 */
export default async function AdminEditUserPage({params}: AdminEditUserPageProps) {

    return <AdminEditUserView userId={(await params).userId}/>
}

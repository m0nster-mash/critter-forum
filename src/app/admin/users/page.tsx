/**
 * @fileOverview    Admin -> User Management
 * @module          features/admin
 */

import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import AdminDashboardView from "@/features/admin/views/admin-dashboard-view";
import AdminUserManagementView from "@/features/admin/user-management/views/admin-user-management-view";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {asc} from "drizzle-orm";
import Link from "next/link";

/**
 * Displays the {@link UserManagementPage}
 *
 * @remarks     Requires the permission declared on {@link ADMIN_ROUTES.USERS_ACCESS}.
 */
export default async function UserManagementPage() {

    return <AdminUserManagementView/>;
}

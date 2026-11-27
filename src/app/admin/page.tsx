/**
 * @fileOverview    Admin -> Dashboard
 * @module          administraton
 */

import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import AdminDashboardView from "@/features/admin/views/admin-dashboard-view";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the AdminDashboardView
 */
export default async function AdminDashboardPage() {

    await requirePagePermission(ADMIN_ROUTES.DASHBOARD.permission);

    return <AdminDashboardView/>;
}

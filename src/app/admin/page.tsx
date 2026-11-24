/**
 * @fileOverview    Admin -> Dashboard
 * @module          features/admin
 */

import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import AdminDashboardPageView from "@/features/admin/views/admin-dashboard-page-view";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the {@link AdminDashboardPageView}
 *
 * @remarks     Requires the permission declared on {@link ADMIN_ROUTES.DASHBOARD}.
 */
export default async function AdminDashboardPage() {

    await requirePagePermission(ADMIN_ROUTES.DASHBOARD.permission);

    return <AdminDashboardPageView/>;
}

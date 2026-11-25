/**
 * @fileOverview    Admin -> Dashboard
 * @module          features/admin
 */

import AdminDashboardView from "@/features/admin/views/admin-dashboard-view";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the {@link AdminDashboardView}
 *
 * @remarks     Requires the permission declared on {@link ADMIN_ROUTES.DASHBOARD}.
 */
export default async function AdminDashboardPage() {

    return <AdminDashboardView/>;
}

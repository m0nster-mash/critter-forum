/**
 * @fileOverview    Admin -> Dashboard
 * @module          features/admin
 */

import AdminDashboardView from "@/features/admin/views/admin-dashboard-view";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the AdminDashboardView
 */
export default async function AdminDashboardPage() {

    return <AdminDashboardView/>;
}

/**
 * @fileOverview    Admin dashboard view
 * @module          features/admin
 */

import {PageHeader} from "@/components/ui/page-header";
import AdminDashboardPanel from "@/features/admin/components/admin-dashboard-panel";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";

/**
 * Displays the {@link AdminDashboardView}
 */
export default async function AdminDashboardView() {

    await requirePagePermission(ADMIN_ROUTES.DASHBOARD.permission);
    return (
        <>
            <PageHeader {...getPageHeaderProps(ADMIN_ROUTES.DASHBOARD)}/>
            <AdminDashboardPanel/>
        </>
    );
}

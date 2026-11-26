/**
 * @fileOverview    Admin dashboard view
 * @module          features/admin
 */

import AdminDashboardPanel from "@/features/admin/components/admin-dashboard-panel";
import {PageHeader} from "@/features/navigation/components/page-header";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";

/**
 * Displays the {@link AdminDashboardView}
 */
export default async function AdminDashboardView() {

    return (
        <>
            <PageHeader {...getPageHeaderProps(ADMIN_ROUTES.DASHBOARD)}/>
            <AdminDashboardPanel/>
        </>
    );
}

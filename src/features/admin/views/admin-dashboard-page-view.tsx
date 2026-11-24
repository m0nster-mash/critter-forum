/**
 * @fileOverview    Admin dashboard view
 * @module          features/admin
 */

import {PageHeader} from "@/components/ui/page-header";
import AdminDashboardPanel from "@/features/admin/components/admin-dashboard-panel";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";

/**
 * Displays the {@link AdminDashboardPageView}
 */
export default async function AdminDashboardPageView() {

    return (
        <>
            <PageHeader {...getPageHeaderProps(ADMIN_ROUTES.DASHBOARD)}/>
            <AdminDashboardPanel/>
        </>
    );
}

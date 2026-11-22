/**
 * @fileOverview    Admin -> Dashboard
 * @module          features/admin
 */

import {requirePagePermission} from "@/features/permissions/server/require-page-permission";
import {ADMIN_ROUTES} from "@/lib/constants/routes";

/**
 * Displays the {@link AdminDashboardPageView}
 *
 * @remarks     Requires the permission declared on {@link ADMIN_ROUTES.DASHBOARD}.
 */
export default async function AdminDashboardPage() {

    await requirePagePermission(ADMIN_ROUTES.DASHBOARD.permission);

    return (
        <>
            Admin dashboard page.
            {/*<AdminDashboardPageView/>*/}
        </>
    );
}

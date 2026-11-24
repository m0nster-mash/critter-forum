/**
 * @fileOverview    Admin dashboard panel component
 * @module          features/admin
 */

import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import Link from "next/link";
import React from "react";

/**
 * Displays the {@link AdminDashboardPanel}
 */
export default async function AdminDashboardPanel() {

    return (
        <>
            Admin dashboard page.
            <ul>
                <li>
                    <Link href={resolvePath(ADMIN_ROUTES.DASHBOARD)}>{ADMIN_ROUTES.DASHBOARD.label}</Link>
                </li>
                <li>
                    <Link href={resolvePath(ADMIN_ROUTES.USERS)}>{ADMIN_ROUTES.USERS.label}</Link>
                </li>
            </ul>
        </>
    );
}

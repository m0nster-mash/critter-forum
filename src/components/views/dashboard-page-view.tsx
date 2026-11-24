/**
 * @fileOverview    Renders the dashboard view
 * @module          core-application
 */

"use client";

import {DashboardPagePanel} from "@/components/panels/dashboard-page-panel";
import {PageHeader} from "@/components/ui/page-header";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {useSession} from "@/lib/auth-client";
import {JSX} from "react";

/**
 * Renders the protected dashboard page view.
 *
 * @remarks     Requires an authenticated session; unauthenticated users are redirected to the login page while the
 *              session is resolving.
 *
 * @returns     {JSX.Element | null}    The dashboard view, or null while authentication status is resolving
 */
export default function DashboardPageView(): JSX.Element | null {

    const {data: session, isPending} = useSession();

    if (isPending || !session?.user) {
        return null;
    }

    return (
        <>
            <PageHeader {...getPageHeaderProps(PRIVATE_ROUTES.DASHBOARD)}/>
            <DashboardPagePanel user={session.user}/>
        </>
    );
}

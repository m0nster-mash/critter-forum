/**
 * TODO: document
 *
 * @module components/views/dashboard-page-view
 * @status Requires documentation
 */

"use client";

import {DashboardPagePanel} from "@/components/panels/dashboard-page-panel";
import {PageHeader} from "@/components/ui/page-header";
import {AUTH_REDIRECT} from "@/features/auth/constants/navigation";
import {useSession} from "@/lib/auth-client";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {redirect} from "next/navigation";
import {JSX} from "react";

/**
 * @status          Requires refactoring
 * @TODO            Replace session checks with proper permission barriers once permissions have been built out
 *
 * @fileOverview    Renders the protected dashboard page view. Requires an authenticated session; unauthenticated users
 *                  are redirected to the login page while the session is resolving.
 *
 * @return          {JSX.Element | null}    The dashboard view, or null while authentication status is resolving
 */
export default function DashboardPageView(): JSX.Element | null {

    const {data: session, isPending} = useSession();

    // TODO:: replace with proper permission barriers once permissions have been built out
    if (!isPending && !session?.user) {
        redirect(AUTH_REDIRECT);
    }

    // TODO:: replace with proper permission barriers once permissions have been built out
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

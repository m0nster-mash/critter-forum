"use client";

import {DashboardPagePanel} from "@/components/panels/dashboard-page-panel";
import {PageHeader} from "@/components/ui/page-header";
import {useSession} from "@/lib/auth-client";
import {REDIRECT} from "@/lib/constants/globals";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {redirect} from "next/navigation";
import {JSX} from "react";

/**
 * Renders the protected dashboard page view.
 *
 * @return  {JSX.Element | null}    The dashboard view component, or null while authentication status is resolving
 */
export default function DashboardPageView(): JSX.Element | null {

    const {data: session, isPending} = useSession();

    if (!isPending && !session?.user) {
        redirect(REDIRECT);
    }

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

"use client";

import {DashboardPagePanel} from "@/components/panels/dashboard-page-panel";
import {PageHeader} from "@/components/ui/page-header";
import {useSession} from "@/lib/auth-client";
import {REDIRECT} from "@/lib/constants/globals";
import {redirect} from "next/navigation";

export default function DashboardPageView() {
    const {data: session, isPending} = useSession();

    if (!isPending && !session?.user) {
        redirect(REDIRECT);
    }

    if (isPending || !session?.user) {
        return null;
    }

    return (
        <>
            <PageHeader title="Dashboard"/>
            <DashboardPagePanel user={session.user} />
        </>
    );
}

import {DashboardPagePanel} from "@/components/panels/dashboard-page-panel";
import {PageHeader} from "@/components/ui/page-header";

export function DashboardPageView() {
    return (
        <>
            <PageHeader title="Dashboard"/>
            <DashboardPagePanel/>
        </>
    );
}

import {HomePagePanel} from "@/components/panels/home-page-panel";
import {PageHeader} from "@/components/ui/page-header";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";

export function HomePageView() {
    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.HOME)}/>
            <HomePagePanel/>
        </>
    );
}

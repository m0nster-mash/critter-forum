import {HomePagePanel} from "@/components/panels/home-page-panel";
import {PageHeader} from "@/components/ui/page-header";

export function HomePageView() {
    return (
        <>
            <PageHeader title="Home Page"/>
            <HomePagePanel/>
        </>
    );
}

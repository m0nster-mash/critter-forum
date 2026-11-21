/**
 * TODO: document
 *
 * @module components/views/home-page-view
 * @status Requires documentation
 */

import {HomePagePanel} from "@/components/panels/home-page-panel";
import {PageHeader} from "@/components/ui/page-header";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {JSX} from "react";

/**
 * @status          Good
 *
 * @fileOverview    Renders the public home page view.
 *
 * @return          {JSX.Element}   The home page view JSX element
 */
export function HomePageView(): JSX.Element {
    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.HOME)}/>
            <HomePagePanel/>
        </>
    );
}

/**
 * @fileOverview    Composes the page header and login panel for the login route.
 * @module          features/auth
 */

import {LoginPanel} from "@/features/auth/components/login-panel";
import {PageHeader} from "@/features/navigation/components/page-header";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {JSX} from "react";

/**
 * Renders the full login page view composition.
 *
 * @returns     {JSX.Element}   The login page view JSX element.
 */
export function LoginPageView(): JSX.Element {

    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.LOGIN)}/>
            <LoginPanel/>
        </>
    );
}

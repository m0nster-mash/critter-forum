/**
 * @fileOverview    TODO: document
 * @module          features/auth
 *
 * @status Requires documentation
 */

import {PageHeader} from "@/components/ui/page-header";
import {RegistrationPanel} from "@/features/auth/components/registration-panel";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {JSX} from "react";

/**
 * Renders the full account registration page view composition.
 *
 * @returns {JSX.Element}   The registration page view JSX element.
 */
/**
 * TODO: document
 *
 * @status Requires documentation
 * @returns TODO: document
 */
export function RegistrationPageView(): JSX.Element {
    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.REGISTER)}/>
            <RegistrationPanel/>
        </>
    );
}

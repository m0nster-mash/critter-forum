/**
 * @fileOverview    Composes the page header and registration panel for account creation.
 * @module          features/auth
 */

import {RegistrationPanel} from "@/features/auth/components/registration-panel";
import {PageHeader} from "@/features/navigation/components/page-header";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {JSX} from "react";

/**
 * Renders the full account registration page view composition.
 *
 * @returns {JSX.Element}   The registration page view JSX element.
 */
export function RegistrationPageView(): JSX.Element {

    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.REGISTER)}/>
            <RegistrationPanel/>
        </>
    );
}

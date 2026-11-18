import {PageHeader} from "@/components/ui/page-header";
import {LoginPanel} from "@/features/auth/components/login-panel";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import {JSX} from "react";

/**
 * Renders the full login page view composition.
 *
 * @return  {JSX.Element}   The login page view JSX element.
 */
export function LoginPageView(): JSX.Element {
    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.LOGIN)}/>
            <LoginPanel/>
        </>
    );
}

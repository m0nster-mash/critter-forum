import {PageHeader} from "@/components/ui/page-header";
import {LoginPanel} from "@/features/auth/components/login-panel";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";

/**
 * TODO:: document
 *
 * @constructor
 */
export function LoginPageView() {
    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.LOGIN)}/>
            <LoginPanel/>
        </>
    );
}

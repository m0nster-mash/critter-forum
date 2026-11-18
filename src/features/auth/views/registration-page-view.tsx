import {PageHeader} from "@/components/ui/page-header";
import {RegistrationPanel} from "@/features/auth/components/registration-panel";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";

/**
 * TODO:: document
 *
 * @constructor
 */
export function RegistrationPageView() {
    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.REGISTER)}/>
            <RegistrationPanel/>
        </>
    );
}

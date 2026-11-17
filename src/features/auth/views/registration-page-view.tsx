import {PageHeader} from "@/components/ui/page-header";
import {RegistrationPanel} from "@/features/auth/components/registration-panel";

export function RegistrationPageView() {
    return (
        <>
            <PageHeader title="Registration"/>
            <RegistrationPanel/>
        </>
    );
}

import {PageHeader} from "@/components/ui/page-header";
import {LoginPanel} from "@/features/auth/components/login-panel";

export function LoginPageView() {
    return (
        <>
            <PageHeader title="Login"/>
            <LoginPanel/>
        </>
    );
}

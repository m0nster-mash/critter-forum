/**
 * @fileOverview    Public -> Login Page
 * @module          `features/auth`
 * @status          Good
 */
import {LoginPageView} from "@/features/auth/views/login-page-view";

/**
 * @remarks     Displays the {@link LoginPageView}
 */
export default function LoginPage() {
    return (
        <>
            <LoginPageView/>
        </>
    );
}

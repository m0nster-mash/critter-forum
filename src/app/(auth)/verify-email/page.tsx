/**
 * @fileOverview    Displays the restricted landing page for authenticated users awaiting email verification.
 * @module          authentication
 */

import {VerifyEmailView} from "@/features/auth/views/verify-email-view";
import {requireUnverifiedAuth} from "@/features/auth/server/session";

/**
 * Displays the verification-pending page to an authenticated, unverified user.
 */
export default async function VerifyEmailPage() {
    const session = await requireUnverifiedAuth();

    return <VerifyEmailView email={session.user.email}/>;
}

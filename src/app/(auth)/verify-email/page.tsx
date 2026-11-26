/**
 * @fileOverview    Displays the restricted landing page for authenticated users awaiting email verification.
 * @module          features/auth
 */

import {requireUnverifiedAuth} from "@/features/auth/server/session";

/** Displays the verification-pending page to an authenticated, unverified user. */
export default async function VerifyEmailPage() {
    await requireUnverifiedAuth();

    return (
        <main>
            <h1>Verify your email address</h1>
            <p>Your account has been created. Verify your email address to access Critter Forum.</p>
            <p>Check your inbox and spam folder for the verification link.</p>
        </main>
    );
}

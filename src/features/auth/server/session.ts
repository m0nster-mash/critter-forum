/**
 * @fileOverview    Provides shared server-side session access and verification-state authentication guards.
 * @module          features/auth
 */

import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {auth} from "@/lib/db/auth/auth";
import {resolvePath} from "@/lib/utilities/route-utils";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {cache} from "react";

/** The authenticated Better Auth session returned by the server API. */
export type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

/**
 * Returns the current Better Auth session, memoized for the current server render.
 *
 * @remarks     Returns `null` when the request has no valid session. Unexpected Better Auth or request errors propagate
 *              to the caller and are not disguised as an ordinary signed-out state.
 *
 * @returns     The current session, or `null` when the visitor is signed out.
 */
export const getSession = cache(async (): Promise<AuthSession | null> => {
    return auth.api.getSession({headers: await headers()});
});

/**
 * Requires an authenticated session without imposing an email-verification policy.
 *
 * @remarks     This is the low-level session guard. Application pages and protected actions should normally use
 *              `requireVerifiedAuth()` or `requireUnverifiedAuth()` so their verification policy is explicit.
 *
 * @returns     The current authenticated session.
 * @throws      A Next.js redirect control-flow error when no valid session exists.
 */
async function requireSession(): Promise<AuthSession> {
    const session = await getSession();

    if (!session) {
        redirect(resolvePath(PUBLIC_ROUTES.LOGIN));
    }

    return session;
}

/**
 * Requires an authenticated user whose email address has been verified.
 *
 * @remarks     Unverified users are sent to the verification-pending route. Use this guard for normal application
 *              pages and server operations; authorization checks should be composed after this guard.
 *
 * @returns     The current verified session.
 * @throws      A Next.js redirect control-flow error when signed out or not yet verified.
 */
export async function requireVerifiedAuth(): Promise<AuthSession> {
    const session = await requireSession();

    if (!session.user.emailVerified) {
        redirect(resolvePath(PRIVATE_ROUTES.VERIFY_EMAIL));
    }

    return session;
}

/**
 * Requires an authenticated user whose email address has not yet been verified.
 *
 * @remarks     Verified users are sent to the dashboard. Use this guard for the verification-pending page and its
 *              future resend/cancellation operations.
 *
 * @returns     The current unverified session.
 * @throws      A Next.js redirect control-flow error when signed out or already verified.
 */
export async function requireUnverifiedAuth(): Promise<AuthSession> {
    const session = await requireSession();

    if (session.user.emailVerified) {
        redirect(resolvePath(PRIVATE_ROUTES.DASHBOARD));
    }

    return session;
}

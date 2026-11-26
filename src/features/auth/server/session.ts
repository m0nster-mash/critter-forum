/**
 * @fileOverview    Provides shared server-side session access and authentication guards.
 * @module          features/auth
 */

import {PUBLIC_ROUTES} from "@/lib/constants/routes";
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
 * Requires an authenticated session. Signed-out visitors are redirected to the login route.
 *
 * @returns     The current authenticated session.
 * @throws      A Next.js redirect control-flow error when no valid session exists.
 */
export async function requireAuth(): Promise<AuthSession> {
    const session = await getSession();

    if (!session) {
        redirect(resolvePath(PUBLIC_ROUTES.LOGIN));
    }

    return session;
}

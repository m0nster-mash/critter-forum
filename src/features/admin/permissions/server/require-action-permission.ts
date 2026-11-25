/**
 * @fileOverview    Guards a server action or server operation behind a directly granted permission.
 * @module          features/admin/permissions
 */

import {ADMIN_ALERT_CODES} from "@/features/admin/constants/alerts";
import {hasPermission} from "@/features/admin/permissions/queries/has-permission";
import type {Permission} from "@/features/admin/permissions/constants/permissions";
import {AlertError} from "@/features/alerts/server/alert-error";
import {requireAuth} from "@/features/auth/server/session";
import type {AuthSession} from "@/features/auth/server/session";

/**
 * Requires authentication and an exact permission grant before an action proceeds.
 *
 * @remarks     Use inside a `safeAction` callback. A signed-out visitor is redirected to login by `requireAuth()`;
 *              an authenticated user without the grant receives the registered admin permission-denied alert.
 * @remarks     Permission lookup failures propagate as unexpected errors and are handled by `safeAction`; they are
 *              never treated as an authorization denial or as permission to proceed.
 *
 * @param       permission      The exact permission required to perform the action
 *
 * @returns     The authenticated session, for use by the protected operation.
 * @throws      `AlertError` when the authenticated user lacks the permission.
 * @throws      A Next.js redirect control-flow error when the visitor is signed out.
 */
export async function requireActionPermission(permission: Permission): Promise<AuthSession> {
    const session = await requireAuth();

    if (!(await hasPermission(session.user.id, permission))) {
        throw new AlertError(ADMIN_ALERT_CODES.PERMISSION_DENIED);
    }

    return session;
}

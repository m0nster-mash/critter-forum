/**
 * @fileOverview    Guards a server-rendered page behind a directly granted permission.
 * @module          features/admin/permissions
 */

import {hasPermission} from "@/features/admin/permissions/queries/has-permission";
import type {Permission} from "@/features/admin/permissions/types";
import {requireAuth} from "@/features/auth/server/session";
import {notFound} from "next/navigation";

/**
 * Requires the current user to hold a permission before a page renders.
 *
 * @remarks     Call it first in the page's server component. Do not rely on a layout: layouts are not re-run when
 *              navigating between pages that share them, and permissions are per page.
 * @remarks     Signed-out visitors are redirected to login by `requireAuth()`. Signed-in users without the permission
 *              receive the standard not-found page, so a protected route's existence is not revealed.
 * @remarks     Next.js redirect and not-found control-flow errors must not be caught by the caller.
 *
 * @param       permission      The exact permission required to view the page
 */
export async function requirePagePermission(
    permission: Permission
): Promise<void> {

    const session = await requireAuth();

    if (!(await hasPermission(session.user.id, permission))) {
        notFound();
    }
}

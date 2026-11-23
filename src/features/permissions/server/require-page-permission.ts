/**
 * @fileOverview    Guards a server-rendered page behind a permission.
 * @module          features/permissions
 */

import {hasPermission} from "@/features/permissions/queries/has-permission";
import type {Permission} from "@/features/permissions/types";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {auth} from "@/lib/db/auth/auth";
import {resolvePath} from "@/lib/utilities/route-utils";
import {headers} from "next/headers";
import {notFound, redirect} from "next/navigation";

/**
 * Requires the current user to hold a permission before a page renders.
 *
 * @remarks     Call it first in the page's server component. Do not rely on a layout: layouts are not re-run when
 *              navigating between pages that share them, and permissions are per page.
 * @remarks     Signed-out visitors are sent to the login page. Signed-in users without the permission get the standard
 *              not-found page, so a protected route's existence is not revealed.
 * @remarks     Both outcomes use Next.js control-flow errors, so never wrap this call in a `try/catch`.
 *
 * @param       permission      The permission required to view the page
 */
export async function requirePagePermission(permission: Permission): Promise<void> {

    const session = await auth.api.getSession({headers: await headers()});

    // TODO:: create and use shared session checking/redirect function
    if (!session) {
        redirect(resolvePath(PUBLIC_ROUTES.LOGIN));
    }

    if (!(await hasPermission(session.user.id, permission))) {
        notFound();
    }
}

/**
 * @fileOverview    Checks whether a user has been granted a permission.
 * @module          features/permissions
 */

import type {Permission} from "@/features/permissions/types";
import {db} from "@/lib/db/auth/db";
import {userPermission} from "@/lib/db/auth/schema";
import {and, eq} from "drizzle-orm";

/**
 * Checks whether a user has been directly granted a permission.
 *
 * @remarks     Permissions are independent: only an exact grant counts, nothing is inherited or implied.
 * @remarks     Server only. Always check on the server; never trust a client-side check for access control.
 *
 * @param       userId          The id of the user to check
 * @param       permission      The permission required
 *
 * @returns     {Promise<boolean>}  True if the user holds the permission.
 */
export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {

    const [grant] = await db
        .select({permission: userPermission.permission})
        .from(userPermission)
        .where(and(eq(userPermission.userId, userId), eq(userPermission.permission, permission)))
        .limit(1);

    return grant !== undefined;
}

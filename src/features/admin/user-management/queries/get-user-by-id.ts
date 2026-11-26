/**
 * @fileOverview    Returns the user data for a selected user, based on the provider user ID.
 * @module          features/admin/user-management
 */

import {GetSelectedUserProps} from "@/features/admin/permissions/types";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";

/**
 * Returns the user data for a selected user, based on the provider user ID.
 *
 * @param       userId  The ID of the desired user
 *
 * @returns     The user data for a selected user, based on the provider user ID.
 */
export async function getUserById({userId}: GetSelectedUserProps) {

    return await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);
}

/**
 * @fileOverview    Returns the user data for a selected user, based on the provider user ID.
 * @module          core-application
 */

import {UserIdParams} from "@/features/admin/permissions/types";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";

export interface GetSelectedUserProps extends UserIdParams {}

/**
 * TODO:: document
 * @param       userId  TODO:: document
 * @return      TODO:: document
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

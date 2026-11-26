/**
 * @fileOverview    Returns all users.
 * @module          features/admin/user-management
 */

import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {asc} from "drizzle-orm";

/**
 * Returns all users.
 *
 * @returns      All users
 */
export async function getAllUsers() {

    return await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)
        .orderBy(asc(user.name));
}

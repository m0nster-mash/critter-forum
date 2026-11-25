/**
 * @fileOverview    Returns all users.
 * @module          core-application
 */

import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {asc} from "drizzle-orm";

/**
 * TODO:: document
 * @return      TODO:: document
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

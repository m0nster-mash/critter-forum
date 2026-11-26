/**
 * @fileOverview    Returns a user matching an email address.
 * @module          features/admin/user-management
 */

import type {GetUserByEmailProps} from "@/features/admin/user-management/types";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {and, eq, ne} from "drizzle-orm";

/**
 * Returns the user associated with an email address.
 *
 * @param input  The email address and optional user ID to exclude.
 *
 * @returns      Matching user identifiers.
 */
export async function getUserByEmail({
                                         email,
                                         excludeUserId,
                                     }: GetUserByEmailProps) {

    return await db
        .select({
            id: user.id,
        })
        .from(user)
        .where(
            excludeUserId
                ? and(
                    eq(user.email, email),
                    ne(user.id, excludeUserId),
                )
                : eq(user.email, email),
        )
        .limit(1);
}

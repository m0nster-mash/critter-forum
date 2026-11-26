/**
 * @fileOverview    Updates a user's editable account details.
 * @module          features/admin/user-management
 */

import type {UpdateUserInput} from "@/features/admin/user-management/types";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";

/**
 * Updates a user's name and email address.
 *
 * @param input  The user identifier and updated account details.
 *
 * @returns      The updated user record, or undefined if no record was updated.
 */
export async function updateUser({
                                     userId,
                                     name,
                                     email,
                                 }: UpdateUserInput) {

    const [updatedUser] = await db
        .update(user)
        .set({
            name,
            email,
        })
        .where(eq(user.id, userId))
        .returning({
            id: user.id,
            name: user.name,
            email: user.email,
        });

    return updatedUser;
}

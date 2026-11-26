/**
 * @fileOverview    Deletes an authenticated account that has not completed email verification.
 * @module          features/auth
 *
 * @TODO            Relocate into `/queries`
 */

import {db} from "@/lib/db/auth/db";
import {user, verification} from "@/lib/db/auth/schema";
import {and, eq} from "drizzle-orm";

/**
 * Removes a pending account and its registration-specific records.
 *
 * @remarks     The user row is locked and rechecked inside the transaction so a verified account cannot be removed
 *              through this flow. User-owned sessions, credential accounts, resend state, revoked token hashes, and
 *              permissions are removed by their cascading foreign keys. Better Auth verification records use the
 *              user's email as their identifier and are deleted explicitly because that table has no user foreign key.
 *
 * @param userId    Authenticated Better Auth user ID.
 * @returns         True when the pending account was deleted; false when it no longer exists or is verified.
 */
export async function cancelPendingRegistration(userId: string): Promise<boolean> {
    return db.transaction(async (tx) => {
        const [pendingUser] = await tx
            .select({id: user.id, email: user.email, emailVerified: user.emailVerified})
            .from(user)
            .where(eq(user.id, userId))
            .for("update");

        if (!pendingUser || pendingUser.emailVerified) {
            return false;
        }

        await tx
            .delete(verification)
            .where(eq(verification.identifier, pendingUser.email));

        const deleted = await tx
            .delete(user)
            .where(and(eq(user.id, userId), eq(user.emailVerified, false)))
            .returning({id: user.id});

        return deleted.length === 1;
    });
}

/**
 * @fileOverview    Removes expired, unverified registrations in bounded transactional batches.
 * @module          features/auth
 *
 * @TODO            Relocate into `/queries`
 */

import {UNVERIFIED_ACCOUNT_CLEANUP_BATCH_SIZE, getUnverifiedAccountExpirationCutoff} from "@/features/auth/constants/expiration-policy";
import {db} from "@/lib/db/auth/db";
import {user, verification} from "@/lib/db/auth/schema";
import {and, eq, inArray, lt} from "drizzle-orm";

export interface UnverifiedAccountCleanupResult {
    deletedCount: number;
    hasMore: boolean;
    cutoff: Date;
}

/**
 * Deletes pending registrations older than the configured retention period.
 *
 * @remarks     Candidate rows are locked and rechecked in the same transaction. This prevents a user who verifies
 *              concurrently from being deleted. User-owned records cascade; Better Auth verification rows are removed
 *              explicitly because their identifier column has no user foreign key. A bounded batch limits lock time.
 */
export async function cleanupExpiredUnverifiedAccounts(
    now = new Date(),
): Promise<UnverifiedAccountCleanupResult> {
    const cutoff = getUnverifiedAccountExpirationCutoff(now);

    const cleanup = await db.transaction(async (tx) => {
        const candidates = await tx
            .select({id: user.id, email: user.email})
            .from(user)
            .where(and(eq(user.emailVerified, false), lt(user.createdAt, cutoff)))
            .orderBy(user.createdAt)
            .limit(UNVERIFIED_ACCOUNT_CLEANUP_BATCH_SIZE + 1)
            .for("update", {skipLocked: true});

        const batch = candidates.slice(0, UNVERIFIED_ACCOUNT_CLEANUP_BATCH_SIZE);
        if (batch.length === 0) return {deletedCount: 0, hasMore: false};

        await tx.delete(verification).where(inArray(verification.identifier, batch.map(({email}) => email)));

        const deleted = await tx
            .delete(user)
            .where(and(
                inArray(user.id, batch.map(({id}) => id)),
                eq(user.emailVerified, false),
                lt(user.createdAt, cutoff),
            ))
            .returning({id: user.id});

        return {deletedCount: deleted.length, hasMore: candidates.length > batch.length};
    });

    return {
        deletedCount: cleanup.deletedCount,
        hasMore: cleanup.hasMore,
        cutoff,
    };
}

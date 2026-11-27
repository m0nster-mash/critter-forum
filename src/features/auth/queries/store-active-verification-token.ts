import {ALGORITHM, ENCODING} from "@/features/auth/constants/policy";
import {db} from "@/lib/db/auth/db";
import {emailVerificationResend, revokedVerificationToken} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";
import {createHash} from "node:crypto";

/**
 * Stores the latest verification token hash and revokes the previously issued token.
 *
 * @remarks     Raw verification tokens are never persisted. Replaced hashes remain on a revocation list until their
 *              original expiry so Better Auth's stateless token verification cannot accept an older link.
 *
 * @param userId       Better Auth user ID.
 * @param token        Newly generated Better Auth verification token.
 * @param expiresAt    Expiry timestamp associated with the new token.
 */
export async function storeActiveVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date,
): Promise<void> {

    const tokenHash = createHash(ALGORITHM)
        .update(token)
        .digest(ENCODING.HEX);

    const now = new Date();

    await db.transaction(async (tx) => {
        await tx
            .insert(emailVerificationResend)
            .values({
                userId,
                attempts: 0,
                windowStartedAt: now,
                lastSentAt: null,
            })
            .onConflictDoNothing();

        const [state] = await tx
            .select({
                tokenHash: emailVerificationResend.tokenHash,
                tokenExpiresAt: emailVerificationResend.tokenExpiresAt,
            })
            .from(emailVerificationResend)
            .where(eq(emailVerificationResend.userId, userId))
            .for("update");

        if (state?.tokenHash && state.tokenHash !== tokenHash && state.tokenExpiresAt &&
            state.tokenExpiresAt > now) {
            await tx
                .insert(revokedVerificationToken)
                .values({
                    tokenHash: state.tokenHash,
                    userId,
                    expiresAt: state.tokenExpiresAt,
                })
                .onConflictDoNothing();
        }

        await tx
            .update(emailVerificationResend)
            .set({tokenHash, tokenExpiresAt: expiresAt})
            .where(eq(emailVerificationResend.userId, userId));
    });
}

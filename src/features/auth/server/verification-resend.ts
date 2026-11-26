/**
 * @fileOverview    Reserves verification-email resend attempts using persistent PostgreSQL state.
 * @module          features/auth
 *
 * @TODO            Relocate into `/queries`
 * @TODO            Replace magic strings with const
 */

import {evaluateVerificationResend} from "@/features/auth/server/verification-resend-policy";
import {db} from "@/lib/db/auth/db";
import {emailVerificationResend, revokedVerificationToken} from "@/lib/db/auth/schema";
import {and, eq, gt} from "drizzle-orm";
import {createHash} from "node:crypto";

/**
 * Atomically checks and reserves one resend attempt for an account.
 *
 * @remarks         A row lock serializes concurrent requests for the same user. Attempts are reserved before provider
 *                  delivery, so provider failures also consume an attempt and cannot be used to bypass the rate limit.
 *
 * @param userId    Authenticated Better Auth user ID.
 * @param now       Current time, injectable for deterministic tests.
 * @returns         Whether the request may proceed and the number of seconds to wait when blocked.
 */
export async function reserveVerificationEmailResend(
    userId: string,
    now: Date = new Date(),
): Promise<{ allowed: boolean; retryAfterSeconds: number; reason?: "cooldown" | "limit" }> {
    return db.transaction(async (tx) => {
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
                attempts: emailVerificationResend.attempts,
                windowStartedAt: emailVerificationResend.windowStartedAt,
                lastSentAt: emailVerificationResend.lastSentAt,
            })
            .from(emailVerificationResend)
            .where(eq(emailVerificationResend.userId, userId))
            .for("update");

        if (!state) {
            throw new Error("Verification resend state could not be loaded.");
        }

        const decision = evaluateVerificationResend(state, now);

        if (!decision.allowed) {
            return {
                allowed: false,
                retryAfterSeconds: decision.retryAfterSeconds,
                reason: decision.reason,
            };
        }

        await tx
            .update(emailVerificationResend)
            .set({
                attempts: decision.attempts,
                windowStartedAt: decision.windowStartedAt,
                lastSentAt: now,
            })
            .where(eq(emailVerificationResend.userId, userId));

        return {
            allowed: true,
            retryAfterSeconds: 0,
        };
    });
}


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
    const tokenHash = createHash("sha256").update(token).digest("hex");
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

/**
 * Checks whether a presented verification token has been superseded by a later email.
 *
 * @param token    Raw Better Auth verification token from the verification URL.
 * @returns        True only when its hash is present in the unexpired revocation list.
 */
export async function isRevokedVerificationToken(token: string): Promise<boolean> {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const [revoked] = await db
        .select({tokenHash: revokedVerificationToken.tokenHash})
        .from(revokedVerificationToken)
        .where(and(
            eq(revokedVerificationToken.tokenHash, tokenHash),
            gt(revokedVerificationToken.expiresAt, new Date()),
        ))
        .limit(1);

    return Boolean(revoked);
}

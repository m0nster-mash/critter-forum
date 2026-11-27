/**
 * @fileOverview    Reserves verification-email resend attempts using persistent PostgreSQL state.
 * @module          authentication
 */

import {RESEND_ERRORS, RESEND_REASON} from "@/features/auth/constants/resend";
import {evaluateVerificationResend} from "@/features/auth/server/verification-resend-policy";
import {db} from "@/lib/db/auth/db";
import {emailVerificationResend} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";

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
): Promise<{
    allowed: boolean;
    retryAfterSeconds: number;
    reason?: typeof RESEND_REASON.COOLDOWN | typeof RESEND_REASON.LIMIT
}> {

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
            throw new Error(RESEND_ERRORS.VERIFICATION_RESEND_FAILURE);
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


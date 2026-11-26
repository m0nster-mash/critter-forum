/**
 * @fileOverview    Evaluates whether another email-verification message may be requested.
 * @module          features/auth
 *
 * @TODO            Migrate interfaces into `types.ts`
 * @                Replace magic strings witg const
 */

import {
    VERIFICATION_RESEND_COOLDOWN_MS,
    VERIFICATION_RESEND_MAX_ATTEMPTS,
    VERIFICATION_RESEND_WINDOW_MS,
} from "@/features/auth/constants/resend-policy";

/** Persisted resend state used by the policy evaluator. */
export interface VerificationResendState {
    attempts: number;
    windowStartedAt: Date;
    lastSentAt: Date | null;
}

/** Result of evaluating one verification-email resend request. */
export interface VerificationResendDecision {
    allowed: boolean;
    attempts: number;
    windowStartedAt: Date;
    retryAfterSeconds: number;
    reason?: "cooldown" | "limit";
}

/**
 * Evaluates a resend request without mutating persisted state.
 *
 * @param state     Current persisted resend state.
 * @param now       Current time, injectable for deterministic tests.
 * @returns         Whether the request may proceed and the state to persist.
 */
export function evaluateVerificationResend(
    state: VerificationResendState,
    now: Date = new Date(),
): VerificationResendDecision {

    const windowExpired = state.attempts > 0
        && now.getTime() - state.windowStartedAt.getTime() >= VERIFICATION_RESEND_WINDOW_MS;
    const startNewWindow = state.attempts === 0 || windowExpired;
    const windowStartedAt = startNewWindow ? now : state.windowStartedAt;
    const attempts = startNewWindow ? 0 : state.attempts;
    const lastSentAt = startNewWindow ? null : state.lastSentAt;
    const windowExpiresAt = windowStartedAt.getTime() + VERIFICATION_RESEND_WINDOW_MS;

    if (lastSentAt) {
        const cooldownExpiresAt = lastSentAt.getTime() + VERIFICATION_RESEND_COOLDOWN_MS;
        if (now.getTime() < cooldownExpiresAt) {
            return {
                allowed: false,
                attempts,
                windowStartedAt,
                retryAfterSeconds: Math.max(1, Math.ceil((cooldownExpiresAt - now.getTime()) / 1000)),
                reason: "cooldown",
            };
        }
    }

    if (attempts >= VERIFICATION_RESEND_MAX_ATTEMPTS) {
        return {
            allowed: false,
            attempts,
            windowStartedAt,
            retryAfterSeconds: Math.max(1, Math.ceil((windowExpiresAt - now.getTime()) / 1000)),
            reason: "limit",
        };
    }

    return {
        allowed: true,
        attempts: attempts + 1,
        windowStartedAt,
        retryAfterSeconds: 0,
    };
}

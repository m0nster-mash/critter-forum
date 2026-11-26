/**
 * @fileOverview    Tests verification-email resend cooldown and attempt-limit policy.
 * @module          features/auth
 */

import {
    VERIFICATION_RESEND_COOLDOWN_MS,
    VERIFICATION_RESEND_MAX_ATTEMPTS,
    VERIFICATION_RESEND_WINDOW_MS,
} from "@/features/auth/constants/resend-policy";
import {evaluateVerificationResend} from "@/features/auth/server/verification-resend-policy";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const now = new Date("2026-11-26T12:00:00.000Z");
const suite = new Suite("auth/verification-resend-policy", 7);

suite.test("allows the first resend attempt and increments the attempt count", () => {
    const result = evaluateVerificationResend({
        attempts: 0,
        windowStartedAt: now,
        lastSentAt: null,
    }, now);

    assert.equal(result.allowed, true);
    assert.equal(result.attempts, 1);
});

suite.test("blocks a second resend during the cooldown", () => {
    const lastSentAt = new Date(now.getTime() - 10_000);
    const result = evaluateVerificationResend({
        attempts: 1,
        windowStartedAt: now,
        lastSentAt,
    }, now);

    assert.equal(result.allowed, false);
    assert.equal(result.reason, "cooldown");
    assert.equal(result.retryAfterSeconds, 50);
});

suite.test("allows a resend once the cooldown has elapsed", () => {
    const lastSentAt = new Date(now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS);
    const result = evaluateVerificationResend({
        attempts: 1,
        windowStartedAt: now,
        lastSentAt,
    }, now);

    assert.equal(result.allowed, true);
    assert.equal(result.attempts, 2);
});

suite.test("blocks attempts after the configured maximum within the window", () => {
    const result = evaluateVerificationResend({
        attempts: VERIFICATION_RESEND_MAX_ATTEMPTS,
        windowStartedAt: new Date(now.getTime() - 60_000),
        lastSentAt: new Date(now.getTime() - VERIFICATION_RESEND_COOLDOWN_MS),
    }, now);

    assert.equal(result.allowed, false);
    assert.equal(result.reason, "limit");
    assert.equal(result.retryAfterSeconds, Math.ceil((VERIFICATION_RESEND_WINDOW_MS - 60_000) / 1000));
});

suite.test("resets the attempt count after the 24-hour window expires", () => {
    const result = evaluateVerificationResend({
        attempts: VERIFICATION_RESEND_MAX_ATTEMPTS,
        windowStartedAt: new Date(now.getTime() - VERIFICATION_RESEND_WINDOW_MS),
        lastSentAt: new Date(now.getTime() - 1_000),
    }, now);

    assert.equal(result.allowed, true);
    assert.equal(result.attempts, 1);
    assert.equal(result.windowStartedAt.getTime(), now.getTime());
});

suite.test("rounds remaining cooldown upward so the UI never unlocks early", () => {
    const lastSentAt = new Date(now.getTime() - 10_500);
    const result = evaluateVerificationResend({
        attempts: 1,
        windowStartedAt: now,
        lastSentAt,
    }, now);

    assert.equal(result.retryAfterSeconds, 50);
});


suite.test("starts the attempt window with the first resend rather than account creation", () => {
    const result = evaluateVerificationResend({
        attempts: 0,
        windowStartedAt: new Date(now.getTime() - 23 * 60 * 60 * 1000),
        lastSentAt: null,
    }, now);

    assert.equal(result.allowed, true);
    assert.equal(result.attempts, 1);
    assert.equal(result.windowStartedAt.getTime(), now.getTime());
});

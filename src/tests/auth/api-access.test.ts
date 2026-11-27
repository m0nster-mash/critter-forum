/**
 * @fileOverview    Verifies Better Auth API access for signed-out, verified, and unverified sessions.
 * @module          authentication
 *
 * @remarks         Better Auth is replaced with a controllable session lookup; no database or auth provider is used.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

let currentSession: { user: { id: string; email: string; emailVerified: boolean } } | null = null;
let resendReservation: { allowed: boolean; retryAfterSeconds: number; reason?: "cooldown" | "limit" } = {
    allowed: true,
    retryAfterSeconds: 0,
};
let reservedUserIds: string[] = [];
let revokedTokens = new Set<string>();

mock.module("@/lib/db/auth/auth", {
    namedExports: {
        auth: {
            api: {
                getSession: async () => currentSession,
            },
        },
    },
});

mock.module("@/features/auth/server/verification-resend", {
    namedExports: {
        reserveVerificationEmailResend: async (userId: string) => {
            reservedUserIds.push(userId);
            return resendReservation;
        },
        isRevokedVerificationToken: async (token: string) => revokedTokens.has(token),
    },
});

const {
    getBetterAuthApiPath,
    isUnverifiedAuthApiPathAllowed,
    withUnverifiedAuthApiRestriction,
} = await import("@/features/auth/server/api-access");

const suite = new Suite("auth/api-access", 15);

suite.test("normalizes paths mounted below the Better Auth API base path", () => {
    assert.equal(getBetterAuthApiPath("/api/auth/sign-out"), "/sign-out");
    assert.equal(getBetterAuthApiPath("/api/auth/verify-email"), "/verify-email");
    assert.equal(getBetterAuthApiPath("/api/auth"), "/");
});

suite.test("preserves paths that are not mounted below the Better Auth API base path", () => {
    assert.equal(getBetterAuthApiPath("/other/path"), "/other/path");
});

suite.test("allows only the session, sign-out, and email-verification endpoints", () => {
    assert.equal(isUnverifiedAuthApiPathAllowed("/get-session"), true);
    assert.equal(isUnverifiedAuthApiPathAllowed("/sign-out"), true);
    assert.equal(isUnverifiedAuthApiPathAllowed("/send-verification-email"), true);
    assert.equal(isUnverifiedAuthApiPathAllowed("/verify-email"), true);
    assert.equal(isUnverifiedAuthApiPathAllowed("/change-password"), false);
    assert.equal(isUnverifiedAuthApiPathAllowed("/update-user"), false);
});

suite.test("delegates requests from signed-out visitors to Better Auth", async () => {
    currentSession = null;
    let called = false;
    const handler = withUnverifiedAuthApiRestriction(async () => {
        called = true;
        return new Response("ok");
    });

    const response = await handler(new Request("https://example.com/api/auth/sign-in/email", {method: "POST"}));

    assert.equal(response.status, 200);
    assert.equal(called, true);
});

suite.test("delegates requests from verified sessions to Better Auth", async () => {
    currentSession = {user: {id: "user-1", email: "verified@example.com", emailVerified: true}};
    let called = false;
    const handler = withUnverifiedAuthApiRestriction(async () => {
        called = true;
        return new Response("ok");
    });

    const response = await handler(new Request("https://example.com/api/auth/update-user", {method: "POST"}));

    assert.equal(response.status, 200);
    assert.equal(called, true);
});

suite.test("delegates allowed verification-flow requests from unverified sessions", async () => {
    currentSession = {user: {id: "user-2", email: "unverified@example.com", emailVerified: false}};
    let called = false;
    const handler = withUnverifiedAuthApiRestriction(async () => {
        called = true;
        return new Response("ok");
    });

    const response = await handler(new Request(
        "https://example.com/api/auth/send-verification-email",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: "unverified@example.com"}),
        },
    ));

    assert.equal(response.status, 200);
    assert.equal(called, true);
});

suite.test("rejects restricted requests from unverified sessions before reaching Better Auth", async () => {
    currentSession = {user: {id: "user-2", email: "unverified@example.com", emailVerified: false}};
    let called = false;
    const handler = withUnverifiedAuthApiRestriction(async () => {
        called = true;
        return new Response("ok");
    });

    const response = await handler(new Request("https://example.com/api/auth/change-password", {method: "POST"}));
    const body = await response.json() as { code: string; message: string };

    assert.equal(response.status, 403);
    assert.equal(body.code, "EMAIL_NOT_VERIFIED");
    assert.equal(called, false);
});

suite.test("does not allow similarly named or nested endpoints through the allowlist", () => {
    assert.equal(isUnverifiedAuthApiPathAllowed("/send-verification-email/extra"), false);
    assert.equal(isUnverifiedAuthApiPathAllowed("/verify-email/extra"), false);
    assert.equal(isUnverifiedAuthApiPathAllowed("/change-email"), false);
});

suite.test("reserves a resend attempt for the authenticated account only", async () => {
    currentSession = {user: {id: "user-3", email: "unverified@example.com", emailVerified: false}};
    resendReservation = {allowed: true, retryAfterSeconds: 0};
    reservedUserIds = [];
    const handler = withUnverifiedAuthApiRestriction(async () => new Response("sent"));

    const response = await handler(new Request("https://example.com/api/auth/send-verification-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: "unverified@example.com"}),
    }));

    assert.equal(response.status, 200);
    assert.deepEqual(reservedUserIds, ["user-3"]);
});

suite.test("rejects a resend request targeting a different email address", async () => {
    currentSession = {user: {id: "user-4", email: "unverified@example.com", emailVerified: false}};
    reservedUserIds = [];
    const handler = withUnverifiedAuthApiRestriction(async () => new Response("sent"));

    const response = await handler(new Request("https://example.com/api/auth/send-verification-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: "someone-else@example.com"}),
    }));

    assert.equal(response.status, 403);
    assert.deepEqual(reservedUserIds, []);
});

suite.test("returns the persistent cooldown or attempt-limit decision as HTTP 429", async () => {
    currentSession = {user: {id: "user-5", email: "unverified@example.com", emailVerified: false}};
    resendReservation = {allowed: false, retryAfterSeconds: 3600, reason: "limit"};
    const handler = withUnverifiedAuthApiRestriction(async () => new Response("sent"));

    const response = await handler(new Request("https://example.com/api/auth/send-verification-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: "unverified@example.com"}),
    }));
    const body = await response.json() as { code: string; retryAfter: number };

    assert.equal(response.status, 429);
    assert.equal(response.headers.get("Retry-After"), "3600");
    assert.equal(body.code, "VERIFICATION_RESEND_LIMIT");
    assert.equal(body.retryAfter, 3600);
});


suite.test("rejects a verification link that was invalidated by a later resend", async () => {
    currentSession = null;
    revokedTokens = new Set(["old-token"]);
    let called = false;
    const handler = withUnverifiedAuthApiRestriction(async () => {
        called = true;
        return new Response("verified");
    });

    const response = await handler(new Request(
        "https://example.com/api/auth/verify-email?token=old-token",
        {method: "GET"},
    ));
    const body = await response.json() as { code: string };

    assert.equal(response.status, 400);
    assert.equal(body.code, "INVALID_VERIFICATION_TOKEN");
    assert.equal(called, false);
});


suite.test("requires an authenticated session before sending a verification email", async () => {
    currentSession = null;
    const handler = withUnverifiedAuthApiRestriction(async () => new Response("sent"));

    const response = await handler(new Request("https://example.com/api/auth/send-verification-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: "unverified@example.com"}),
    }));

    assert.equal(response.status, 401);
});

suite.test("rejects resend requests for an already verified account", async () => {
    currentSession = {user: {id: "user-6", email: "verified@example.com", emailVerified: true}};
    const handler = withUnverifiedAuthApiRestriction(async () => new Response("sent"));

    const response = await handler(new Request("https://example.com/api/auth/send-verification-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: "verified@example.com"}),
    }));

    assert.equal(response.status, 409);
});

suite.test("returns the shorter resend cooldown as HTTP 429", async () => {
    currentSession = {user: {id: "user-7", email: "unverified@example.com", emailVerified: false}};
    resendReservation = {allowed: false, retryAfterSeconds: 42, reason: "cooldown"};
    const handler = withUnverifiedAuthApiRestriction(async () => new Response("sent"));

    const response = await handler(new Request("https://example.com/api/auth/send-verification-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: "unverified@example.com"}),
    }));
    const body = await response.json() as { code: string; retryAfter: number; message: string };

    assert.equal(response.status, 429);
    assert.equal(response.headers.get("Retry-After"), "42");
    assert.equal(body.code, "VERIFICATION_RESEND_COOLDOWN");
    assert.equal(body.retryAfter, 42);
    assert.match(body.message, /42 seconds/);
});

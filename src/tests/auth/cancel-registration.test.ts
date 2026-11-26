/**
 * @fileOverview    Verifies the password-confirmed pending-registration cancellation endpoint.
 * @module          features/auth
 *
 * @remarks         Better Auth and the account-deletion service are controlled doubles; no database is contacted.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

let currentSession: { user: { id: string; email: string; emailVerified: boolean } } | null = null;
let passwordError: Error | null = null;
let deleted = true;
let verifiedPassword: string | null = null;
let cancelledUserId: string | null = null;

mock.module("@/lib/db/auth/auth", {
    namedExports: {
        auth: {
            api: {
                getSession: async () => currentSession,
                verifyPassword: async ({body}: { body: { password: string } }) => {
                    verifiedPassword = body.password;
                    if (passwordError) throw passwordError;
                    return {status: true};
                },
            },
        },
    },
});

mock.module("@/features/auth/server/cancel-registration", {
    namedExports: {
        cancelPendingRegistration: async (userId: string) => {
            cancelledUserId = userId;
            return deleted;
        },
    },
});

const {POST} = await import("@/app/api/auth/cancel-registration/route");

function makeRequest(body: unknown = {password: "correct-password"}, origin = "https://example.com") {
    return new Request("https://example.com/api/auth/cancel-registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Origin: origin,
        },
        body: JSON.stringify(body),
    });
}

function reset(): void {
    currentSession = {user: {id: "pending-user", email: "pending@example.com", emailVerified: false}};
    passwordError = null;
    deleted = true;
    verifiedPassword = null;
    cancelledUserId = null;
}

const suite = new Suite("auth/cancel-registration", 7);

suite.test("rejects requests that do not have a matching same-origin header", async () => {
    reset();
    const response = await POST(makeRequest(undefined, "https://attacker.example"));
    assert.equal(response.status, 403);
    assert.equal(verifiedPassword, null);
});

suite.test("requires an authenticated session", async () => {
    reset();
    currentSession = null;
    const response = await POST(makeRequest());
    assert.equal(response.status, 401);
});

suite.test("refuses cancellation for an already verified account", async () => {
    reset();
    currentSession!.user.emailVerified = true;
    const response = await POST(makeRequest());
    assert.equal(response.status, 409);
    assert.equal(verifiedPassword, null);
});

suite.test("requires a non-empty password", async () => {
    reset();
    const response = await POST(makeRequest({password: ""}));
    assert.equal(response.status, 400);
    assert.equal(cancelledUserId, null);
});

suite.test("does not delete the account when password confirmation fails", async () => {
    reset();
    passwordError = new Error("invalid password");
    const response = await POST(makeRequest({password: "incorrect-password"}));
    assert.equal(response.status, 401);
    assert.equal(verifiedPassword, "incorrect-password");
    assert.equal(cancelledUserId, null);
});

suite.test("deletes only the current authenticated pending account after password confirmation", async () => {
    reset();
    const response = await POST(makeRequest());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {success: true});
    assert.equal(verifiedPassword, "correct-password");
    assert.equal(cancelledUserId, "pending-user");
});

suite.test("returns a conflict if the account became unavailable before deletion", async () => {
    reset();
    deleted = false;
    const response = await POST(makeRequest());
    assert.equal(response.status, 409);
    assert.equal(cancelledUserId, "pending-user");
});

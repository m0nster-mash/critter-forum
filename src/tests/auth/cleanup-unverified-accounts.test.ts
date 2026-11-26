/**
 * @fileOverview    Verifies authorization and responses for scheduled pending-account cleanup.
 * @module          features/auth
 * @remarks         The cleanup service is mocked; no database is contacted.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

let cleanupCalls = 0;
let cleanupError = false;

mock.module("@/features/auth/server/cleanup-unverified-accounts", {
    namedExports: {
        cleanupExpiredUnverifiedAccounts: async () => {
            cleanupCalls += 1;
            if (cleanupError) throw new Error("database unavailable");
            return {deletedCount: 3, hasMore: false, cutoff: new Date("2026-11-19T12:00:00.000Z")};
        },
    },
});

const {GET} = await import("@/app/api/cron/cleanup-unverified-accounts/route");

function request(secret?: string): Request {
    return new Request("https://example.com/api/cron/cleanup-unverified-accounts", {
        headers: secret ? {Authorization: `Bearer ${secret}`} : {},
    });
}

function reset(): void {
    cleanupCalls = 0;
    cleanupError = false;
    process.env.CRON_SECRET = "test-cron-secret";
}

const suite = new Suite("auth/cleanup-unverified-accounts", 5);

suite.test("rejects a missing authorization header", async () => {
    reset();
    const response = await GET(request());
    assert.equal(response.status, 401);
    assert.equal(cleanupCalls, 0);
});

suite.test("rejects an incorrect secret", async () => {
    reset();
    const response = await GET(request("wrong-secret"));
    assert.equal(response.status, 401);
    assert.equal(cleanupCalls, 0);
});

suite.test("rejects requests when no cron secret is configured", async () => {
    reset();
    delete process.env.CRON_SECRET;
    const response = await GET(request("test-cron-secret"));
    assert.equal(response.status, 401);
    assert.equal(cleanupCalls, 0);
});

suite.test("runs one cleanup batch for a valid bearer secret", async () => {
    reset();
    const response = await GET(request("test-cron-secret"));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
        success: true,
        deletedCount: 3,
        hasMore: false,
        cutoff: "2026-11-19T12:00:00.000Z",
    });
    assert.equal(cleanupCalls, 1);
});

suite.test("returns a generic server error when cleanup fails", async () => {
    reset();
    cleanupError = true;
    const response = await GET(request("test-cron-secret"));
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {error: "Pending-account cleanup failed."});
});

/**
 * @fileOverview    Verifies the page guard's redirect, not-found, and fail-closed behaviour.
 * @module          features/admin/permissions
 *
 * @remarks         The shared session helper, Next.js not-found control flow, and permission query are replaced with
 *                  controllable doubles, so this suite needs no running app or database.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import type {Permission} from "@/features/admin/permissions/types";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

/** Thrown by the stubbed `requireAuth()`, standing in for its login redirect. */
class RedirectSignal extends Error {
    constructor(readonly url: string) {
        super(`redirect:${url}`);
    }
}

/** Thrown by the stubbed `notFound()`, standing in for Next.js's not-found control-flow error. */
class NotFoundSignal extends Error {
    constructor() {
        super("not-found");
    }
}

/** Session returned by the shared auth helper; `null` means signed out. */
let currentSession: {user: {id: string}} | null = null;
/** Permissions held per user id. */
let grants = new Map<string, Set<Permission>>();
/** When set, the permission lookup throws this error. */
let lookupError: Error | null = null;
/** Every `[userId, permission]` pair the guard asked about. */
let lookups: Array<[string, Permission]> = [];

mock.module("next/navigation", {
    namedExports: {
        notFound: (): never => {
            throw new NotFoundSignal();
        },
    },
});
mock.module("@/features/auth/server/session", {
    namedExports: {
        requireAuth: async () => {
            if (!currentSession) {
                throw new RedirectSignal("/login");
            }
            return currentSession;
        },
    },
});
mock.module("@/features/admin/permissions/queries/has-permission", {
    namedExports: {
        hasPermission: async (userId: string, permission: Permission) => {
            lookups.push([userId, permission]);
            if (lookupError) {
                throw lookupError;
            }
            return grants.get(userId)?.has(permission) ?? false;
        },
    },
});

const {requirePagePermission} = await import("@/features/admin/permissions/server/require-page-permission");

/** Resets the doubles to a known state before each test. */
function arrange(options: {
    session?: {user: {id: string}} | null;
    grants?: Record<string, Permission[]>;
    lookupError?: Error;
} = {}): void {
    currentSession = options.session ?? null;
    grants = new Map(Object.entries(options.grants ?? {}).map(([id, list]) => [id, new Set(list)]));
    lookupError = options.lookupError ?? null;
    lookups = [];
}

const suite = new Suite("permissions/require-page-permission", 6);

suite.test("redirects a signed-out visitor to login without checking permissions", async () => {
    arrange({session: null});

    await assert.rejects(
        () => requirePagePermission(PERMISSIONS.ADMIN_ACCESS),
        (error) => error instanceof RedirectSignal && error.url === "/login",
    );
    assert.deepEqual(lookups, []);
});

suite.test("shows not-found to a signed-in user who lacks the permission", async () => {
    arrange({session: {user: {id: "user-1"}}});

    await assert.rejects(
        () => requirePagePermission(PERMISSIONS.ADMIN_ACCESS),
        (error) => error instanceof NotFoundSignal,
    );
});

suite.test("lets a user through when they hold the exact permission", async () => {
    arrange({session: {user: {id: "user-1"}}, grants: {"user-1": [PERMISSIONS.ADMIN_ACCESS]}});

    await assert.doesNotReject(() => requirePagePermission(PERMISSIONS.ADMIN_ACCESS));
});

suite.test("checks the signed-in user's own id against the permission the page requires", async () => {
    arrange({
        session: {user: {id: "user-1"}},
        grants: {"user-2": [PERMISSIONS.ADMIN_ACCESS]},
    });

    await assert.rejects(() => requirePagePermission(PERMISSIONS.ADMIN_ACCESS), NotFoundSignal);
    assert.deepEqual(lookups, [["user-1", PERMISSIONS.ADMIN_ACCESS]]);
});

suite.test("keeps admin permissions independent in both directions", async () => {
    arrange({session: {user: {id: "user-1"}}, grants: {"user-1": [PERMISSIONS.ADMIN_ACCESS]}});
    await assert.doesNotReject(() => requirePagePermission(PERMISSIONS.ADMIN_ACCESS));
    await assert.rejects(() => requirePagePermission(PERMISSIONS.ADMIN_USERS_ACCESS), NotFoundSignal);

    arrange({session: {user: {id: "user-1"}}, grants: {"user-1": [PERMISSIONS.ADMIN_USERS_ACCESS]}});
    await assert.doesNotReject(() => requirePagePermission(PERMISSIONS.ADMIN_USERS_ACCESS));
    await assert.rejects(() => requirePagePermission(PERMISSIONS.ADMIN_ACCESS), NotFoundSignal);
});

suite.test("surfaces permission lookup failures instead of treating them as access", async () => {
    const failure = new Error("database unavailable");
    arrange({session: {user: {id: "user-1"}}, lookupError: failure});

    await assert.rejects(() => requirePagePermission(PERMISSIONS.ADMIN_ACCESS), failure);
});

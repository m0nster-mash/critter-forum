/**
 * @fileOverview    Verifies action authorization, expected denial alerts, and fail-closed behaviour.
 * @module          features/admin/permissions
 *
 * @remarks         The shared session helper and permission query are replaced with controllable doubles, so this suite
 *                  needs no running app or database.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {ADMIN_ALERT_CODES} from "@/features/admin/constants/alerts";
import type {Permission} from "@/features/admin/permissions/constants/permissions";
import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {isAlertError} from "@/features/alerts/server/alert-error";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

class RedirectSignal extends Error {
    constructor(readonly url: string) {
        super(`redirect:${url}`);
    }
}

let currentSession: { user: { id: string } } | null = null;
let grants = new Map<string, Set<Permission>>();
let lookupError: Error | null = null;
let lookups: Array<[string, Permission]> = [];

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

const {requireActionPermission} = await import("@/features/admin/permissions/server/require-action-permission");

function arrange(options: {
    session?: { user: { id: string } } | null;
    grants?: Record<string, Permission[]>;
    lookupError?: Error;
} = {}): void {
    currentSession = options.session ?? null;
    grants = new Map(Object.entries(options.grants ?? {}).map(([id, list]) => [id, new Set(list)]));
    lookupError = options.lookupError ?? null;
    lookups = [];
}

const suite = new Suite("permissions/require-action-permission", 5);

suite.test("redirects signed-out visitors through the shared auth guard", async () => {
    arrange({session: null});

    await assert.rejects(
        () => requireActionPermission(PERMISSIONS.ADMIN_USERS_EDIT),
        (error) => error instanceof RedirectSignal && error.url === "/login",
    );
    assert.deepEqual(lookups, []);
});

suite.test("throws the registered alert exception when the exact grant is missing", async () => {
    arrange({session: {user: {id: "user-1"}}});

    await assert.rejects(
        () => requireActionPermission(PERMISSIONS.ADMIN_USERS_EDIT),
        (error) => isAlertError(error) && error.code === ADMIN_ALERT_CODES.PERMISSION_DENIED,
    );
});

suite.test("returns the authenticated session when the user holds the exact grant", async () => {
    const session = {user: {id: "user-1"}};
    arrange({session, grants: {"user-1": [PERMISSIONS.ADMIN_USERS_EDIT]}});

    assert.deepEqual(await requireActionPermission(PERMISSIONS.ADMIN_USERS_EDIT), session);
    assert.deepEqual(lookups, [["user-1", PERMISSIONS.ADMIN_USERS_EDIT]]);
});

suite.test("does not allow one admin permission to imply another", async () => {
    arrange({session: {user: {id: "user-1"}}, grants: {"user-1": [PERMISSIONS.ADMIN_USERS_ACCESS]}});

    await assert.rejects(
        () => requireActionPermission(PERMISSIONS.ADMIN_USERS_EDIT),
        (error) => isAlertError(error) && error.code === ADMIN_ALERT_CODES.PERMISSION_DENIED,
    );
});

suite.test("surfaces permission lookup failures instead of disguising them as denials", async () => {
    const failure = new Error("database unavailable");
    arrange({session: {user: {id: "user-1"}}, lookupError: failure});

    await assert.rejects(() => requireActionPermission(PERMISSIONS.ADMIN_USERS_EDIT), failure);
});

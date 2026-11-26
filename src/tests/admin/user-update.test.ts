/**
 * @fileOverview    Verifies authorization and name-only behaviour for the admin user update action.
 * @module          features/admin/user-management
 *
 * @remarks         External permission, database, and safe-action dependencies are replaced with deterministic
 *                  doubles; this suite does not require a database.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {ADMIN_ALERT_CODES} from "@/features/admin/constants/alerts";
import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

let permissionCalls: string[] = [];
let lookupResult: Array<{ id: string }> = [{id: "user-1"}];
let updateResult: { id: string; name: string; email: string } | undefined = {
    id: "user-1",
    name: "Updated Name",
    email: "user@example.com",
};
let updateCalls: Array<{ userId: string; name: string }> = [];

mock.module("@/features/admin/permissions/server/require-action-permission", {
    namedExports: {
        requireActionPermission: async (permission: string) => {
            permissionCalls.push(permission);
            return {user: {id: "admin-user"}};
        },
    },
});
mock.module("@/features/admin/user-management/queries/get-user-by-id", {
    namedExports: {getUserById: async () => lookupResult},
});
mock.module("@/features/admin/user-management/queries/update-user", {
    namedExports: {
        updateUser: async (input: { userId: string; name: string }) => {
            updateCalls.push(input);
            return updateResult;
        },
    },
});
mock.module("@/features/alerts/server/safe-action", {
    namedExports: {
        safeAction: (_name: string, action: (...args: never[]) => unknown) => action,
    },
});

const {updateUserAction} = await import("@/features/admin/user-management/actions/update-user-action");

function reset(): void {
    permissionCalls = [];
    lookupResult = [{id: "user-1"}];
    updateResult = {id: "user-1", name: "Updated Name", email: "user@example.com"};
    updateCalls = [];
}

const suite = new Suite("admin/user-update", 4);

suite.test("requires the exact edit permission before looking up or updating a user", async () => {
    reset();
    const result = await updateUserAction({userId: " user-1 ", name: " Updated Name "});
    assert.equal(result.ok, true);
    assert.deepEqual(permissionCalls, [PERMISSIONS.ADMIN_USERS_EDIT]);
});

suite.test("normalizes and persists only the target id and display name", async () => {
    reset();
    await updateUserAction({userId: " user-1 ", name: " Updated Name "});
    assert.deepEqual(updateCalls, [{userId: "user-1", name: "Updated Name"}]);
    assert.equal(Object.hasOwn(updateCalls[0], "email"), false);
});

suite.test("rejects an empty display name without querying or mutating a user", async () => {
    reset();
    const result = await updateUserAction({userId: "user-1", name: "   "});
    assert.equal(result.ok, false);
    assert.equal(updateCalls.length, 0);
});

suite.test("returns a not-found failure when the selected user does not exist", async () => {
    reset();
    lookupResult = [];
    const result = await updateUserAction({userId: "missing-user", name: "Name"});
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.alert.code, ADMIN_ALERT_CODES.USER_NOT_FOUND);
    assert.equal(updateCalls.length, 0);
});

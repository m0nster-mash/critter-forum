/**
 * @fileOverview    Verifies that protected app routes invoke their server-side guard at the route entry point.
 * @module          core-application
 *
 * @remarks         Route views are replaced with inert components so these tests exercise page entry points without
 *                  rendering UI, connecting to the database, or invoking Better Auth.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

let authCalls = 0;
let permissionCalls: string[] = [];

mock.module("@/features/auth/server/session", {
    namedExports: {
        requireAuth: async () => {
            authCalls += 1;
            return {user: {id: "test-user"}};
        },
    },
});
mock.module("@/features/admin/permissions/server/require-page-permission", {
    namedExports: {
        requirePagePermission: async (permission: string) => {
            permissionCalls.push(permission);
        },
    },
});

for (const moduleName of [
    "@/features/users/views/settings-page-view",
    "@/components/views/dashboard-page-view",
    "@/features/admin/views/admin-dashboard-view",
    "@/features/admin/user-management/views/admin-user-management-view",
    "@/features/admin/user-management/views/admin-edit-user-view",
]) {
    mock.module(moduleName, {defaultExport: () => null});
}

const {default: SettingsPage} = await import("@/app/(dashboard)/settings/page");
const {default: DashboardPage} = await import("@/app/(dashboard)/dashboard/page");
const {default: AdminDashboardPage} = await import("@/app/admin/page");
const {default: UserManagementPage} = await import("@/app/admin/users/page");
const {default: AdminEditUserPage} = await import("@/app/admin/users/[userId]/edit/page");

function reset(): void {
    authCalls = 0;
    permissionCalls = [];
}

const suite = new Suite("routes/page-guards", 5);

suite.test("settings requires a server session before rendering its client view", async () => {
    reset();
    await SettingsPage();
    assert.equal(authCalls, 1);
    assert.deepEqual(permissionCalls, []);
});

suite.test("dashboard requires a server session before rendering its client view", async () => {
    reset();
    await DashboardPage();
    assert.equal(authCalls, 1);
    assert.deepEqual(permissionCalls, []);
});

suite.test("admin dashboard checks its route permission at the page entry point", async () => {
    reset();
    await AdminDashboardPage();
    assert.deepEqual(permissionCalls, [ADMIN_ROUTES.DASHBOARD.permission]);
});

suite.test("admin user management checks its own route permission at the page entry point", async () => {
    reset();
    await UserManagementPage();
    assert.deepEqual(permissionCalls, [ADMIN_ROUTES.USERS_ACCESS.permission]);
});

suite.test("admin user edit checks its own route permission at the page entry point", async () => {
    reset();
    await AdminEditUserPage({params: Promise.resolve({userId: "target-user"})});
    assert.deepEqual(permissionCalls, [ADMIN_ROUTES.USERS_EDIT.permission]);
});

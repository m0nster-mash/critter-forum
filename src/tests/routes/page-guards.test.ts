/**
 * @fileOverview    Verifies that protected app routes invoke their verification-state guard at the route entry point.
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

let verifiedAuthCalls = 0;
let unverifiedAuthCalls = 0;
let permissionCalls: string[] = [];

mock.module("@/features/auth/server/session", {
    namedExports: {
        requireVerifiedAuth: async () => {
            verifiedAuthCalls += 1;
            return {user: {id: "test-user", emailVerified: true}};
        },
        requireUnverifiedAuth: async () => {
            unverifiedAuthCalls += 1;
            return {user: {id: "test-user", emailVerified: false}};
        },
    },
});
mock.module("@/features/admin/user-management/queries/get-user-by-id", {
    namedExports: {
        getUserById: async () => [{id: "test-user", name: "Test User", email: "test@example.com"}],
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
    "@/features/alerts/views/alert-test-page-view",
]) {
    mock.module(moduleName, {defaultExport: () => null});
}

const {default: SettingsPage} = await import("@/app/(dashboard)/settings/page");
const {default: DashboardPage} = await import("@/app/(dashboard)/dashboard/page");
const {default: ProfilePage} = await import("@/app/(dashboard)/profile/[userId]/page");
const {default: AdminDashboardPage} = await import("@/app/admin/page");
const {default: UserManagementPage} = await import("@/app/admin/users/page");
const {default: AdminEditUserPage} = await import("@/app/admin/users/[userId]/edit/page");
const {default: VerifyEmailPage} = await import("@/app/(auth)/verify-email/page");
const {default: AlertTestPage} = await import("@/app/(temp)/alerts/page");

function reset(): void {
    verifiedAuthCalls = 0;
    unverifiedAuthCalls = 0;
    permissionCalls = [];
}

const suite = new Suite("routes/page-guards", 8);

suite.test("settings requires verified authentication before rendering its client view", async () => {
    reset();
    await SettingsPage();
    assert.equal(verifiedAuthCalls, 1);
    assert.deepEqual(permissionCalls, []);
});

suite.test("dashboard requires verified authentication before rendering its client view", async () => {
    reset();
    await DashboardPage();
    assert.equal(verifiedAuthCalls, 1);
    assert.deepEqual(permissionCalls, []);
});

suite.test("profile requires verified authentication before loading the user's profile", async () => {
    reset();
    await ProfilePage({params: Promise.resolve({userId: "test-user"})});
    assert.equal(verifiedAuthCalls, 1);
});

suite.test("admin pages use the permission guard, which requires verified authentication", async () => {
    reset();
    await AdminDashboardPage();
    assert.deepEqual(permissionCalls, [ADMIN_ROUTES.DASHBOARD.permission]);

    reset();
    await UserManagementPage();
    assert.deepEqual(permissionCalls, [ADMIN_ROUTES.USERS_ACCESS.permission]);

    reset();
    await AdminEditUserPage({params: Promise.resolve({userId: "target-user"})});
    assert.deepEqual(permissionCalls, [ADMIN_ROUTES.USERS_EDIT.permission]);
});

suite.test("verification-pending page requires an unverified session", async () => {
    reset();
    await VerifyEmailPage();
    assert.equal(unverifiedAuthCalls, 1);
    assert.equal(verifiedAuthCalls, 0);
});

suite.test("normal private pages never call the unverified-only guard", async () => {
    reset();
    await SettingsPage();
    await DashboardPage();
    assert.equal(unverifiedAuthCalls, 0);
    assert.equal(verifiedAuthCalls, 2);
});

suite.test("the verification-pending page does not run admin permission checks", async () => {
    reset();
    await VerifyEmailPage();
    assert.deepEqual(permissionCalls, []);
});

suite.test("temporary alert test page also requires verified authentication", async () => {
    reset();
    await AlertTestPage();
    assert.equal(verifiedAuthCalls, 1);
});

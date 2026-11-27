/**
 * @fileOverview    Verifies every protected route declares a valid permission, and that the admin routes stay independent.
 * @module          features/admin/permissions
 */

import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {ADMIN_ROUTES, ALL_ROUTES, PRIVATE_ROUTES, type RouteMetadata} from "@/lib/constants/routes";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const suite = new Suite("permissions/routes", 5);

/** Every registered route, paired with its registry key for readable failures. */
const routes = Object.entries(ALL_ROUTES) as Array<[string, RouteMetadata]>;

suite.test("every admin-level route declares a permission", () => {
    for (const [key, route] of routes.filter(([, route]) => route.accessLevel === "admin")) {
        assert.ok(route.permission, `${key} (${String(route.path)}) has accessLevel "admin" but no permission`);
    }
});

suite.test("every declared permission is a defined permission", () => {
    const defined = new Set<string>(Object.values(PERMISSIONS));

    for (const [key, route] of routes.filter(([, route]) => route.permission !== undefined)) {
        assert.ok(defined.has(route.permission as string), `${key} declares unknown permission "${route.permission}"`);
    }
});

suite.test("/admin and /admin/users require different permissions", () => {
    assert.notEqual(ADMIN_ROUTES.DASHBOARD.permission, ADMIN_ROUTES.USERS_ACCESS.permission);
});

suite.test("/admin requires admin.access and /admin/users requires admin.users.access", () => {
    assert.equal(ADMIN_ROUTES.DASHBOARD.path, "/admin");
    assert.equal(ADMIN_ROUTES.DASHBOARD.permission, PERMISSIONS.ADMIN_ACCESS);
    assert.equal(ADMIN_ROUTES.USERS_ACCESS.path, "/admin/users");
    assert.equal(ADMIN_ROUTES.USERS_ACCESS.permission, PERMISSIONS.ADMIN_USERS_ACCESS);
});

suite.test("verification-pending route is private and does not require an admin permission", () => {
    assert.equal(PRIVATE_ROUTES.VERIFY_EMAIL.path, "/verify-email");
    assert.equal(PRIVATE_ROUTES.VERIFY_EMAIL.accessLevel, "private");
    assert.equal("permission" in PRIVATE_ROUTES.VERIFY_EMAIL, false);
});

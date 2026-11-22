/**
 * @fileOverview    Verifies every protected route declares a valid permission, and that the admin routes stay independent.
 * @module          features/permissions
 */

import assert from "node:assert/strict";
import {PERMISSIONS} from "@/features/permissions/constants/permissions";
import {ADMIN_ROUTES, ALL_ROUTES, type RouteMetadata} from "@/lib/constants/routes";
import {Suite} from "@/tests/test.config";

const suite = new Suite("permissions/routes", 4);

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
    assert.notEqual(ADMIN_ROUTES.DASHBOARD.permission, ADMIN_ROUTES.USERS.permission);
});

suite.test("/admin requires admin.access and /admin/users requires admin.users.access", () => {
    assert.equal(ADMIN_ROUTES.DASHBOARD.path, "/admin");
    assert.equal(ADMIN_ROUTES.DASHBOARD.permission, PERMISSIONS.ADMIN_ACCESS);
    assert.equal(ADMIN_ROUTES.USERS.path, "/admin/users");
    assert.equal(ADMIN_ROUTES.USERS.permission, PERMISSIONS.ADMIN_USERS_ACCESS);
});

/**
 * @fileOverview    Verifies the permission identifiers are well-formed, unique, and stable.
 * @module          features/admin/permissions
 */

import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const suite = new Suite("permissions/constants", 5);

/** Every defined permission as `[constant key, stored value]`. */
const entries = Object.entries(PERMISSIONS);

suite.test("every permission value is unique", () => {
    const values = entries.map(([, value]) => value);

    assert.equal(new Set(values).size, values.length);
});

suite.test("every permission value follows the `area.resource.action` convention", () => {
    for (const [key, value] of entries) {
        assert.match(value, /^[a-z]+(\.[a-z]+)+$/, `${key}: "${value}"`);
    }
});

suite.test("every constant key mirrors its value", () => {
    for (const [key, value] of entries) {
        assert.equal(key, value.toUpperCase().replaceAll(".", "_"), `${key} should mirror "${value}"`);
    }
});

suite.test("the admin permissions are distinct, so each can be granted independently", () => {
    assert.notEqual(PERMISSIONS.ADMIN_ACCESS, PERMISSIONS.ADMIN_USERS_ACCESS);
});

suite.test("stored values are pinned (they are persisted; renaming one orphans existing grants)", () => {
    assert.equal(PERMISSIONS.ADMIN_ACCESS, "admin.access");
    assert.equal(PERMISSIONS.ADMIN_USERS_ACCESS, "admin.users.access");
});

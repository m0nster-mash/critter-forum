/**
 * @fileOverview    Verifies permission grants against a real PostgreSQL database.
 * @module          features/permissions
 *
 * @remarks         Runs only when `TEST_DATABASE_URL` is set; otherwise every test is skipped. Point it at a database
 *                  that is separate from development and has the migrations applied:
 *                  `DATABASE_URL=<test url> npm run db:migrate`
 * @remarks         Each test creates its own users with unique ids and every row is removed afterwards, so nothing
 *                  else in the database is touched.
 */

import "dotenv/config";
import {PERMISSIONS} from "@/features/permissions/constants/permissions";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {after} from "node:test";

/** Database dedicated to tests; the integration tests are skipped without it. */
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
const enabled = Boolean(TEST_DATABASE_URL);

/**
 * Loads the database modules against the test database.
 *
 * @remarks     `db.ts` reads `DATABASE_URL` when first imported, so the override must happen before the import. This is
 *              why the modules are imported dynamically rather than at the top of the file.
 */
async function loadDatabase() {
    process.env.DATABASE_URL = TEST_DATABASE_URL;

    const {db} = await import("@/lib/db/auth/db");
    const {user, userPermission} = await import("@/lib/db/auth/schema");
    const {hasPermission} = await import("@/features/permissions/queries/has-permission");
    const {and, eq, inArray} = await import("drizzle-orm");

    return {db, user, userPermission, hasPermission, and, eq, inArray};
}

const database = enabled ? await loadDatabase() : null;

/** Ids of the users created by this file, removed in `after`. */
const createdUserIds: string[] = [];

/** Returns the loaded database modules; only callable in tests that are enabled. */
function getDatabase() {
    assert.ok(database, "TEST_DATABASE_URL must be set");
    return database;
}

/** Creates a throwaway user and returns its id. */
async function createUser(): Promise<string> {
    const {db, user} = getDatabase();
    const id = `perm-test-${randomUUID()}`;

    await db.insert(user).values({id, name: "Permission Test", email: `${id}@test.local`});
    createdUserIds.push(id);

    return id;
}

/** Grants a permission to a user. */
async function grant(userId: string, permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS]): Promise<void> {
    const {db, userPermission} = getDatabase();

    await db.insert(userPermission).values({userId, permission});
}

after(async () => {
    if (!database) {
        return;
    }
    const {db, user, inArray} = database;

    if (createdUserIds.length > 0) {
        await db.delete(user).where(inArray(user.id, createdUserIds));
    }
    await db.$client.end();
});

const suite = new Suite("permissions/has-permission (database)", 8);

suite.skipUnlessEnabled("returns false for a user with no grants", enabled, async () => {
    const {hasPermission} = getDatabase();
    const userId = await createUser();

    assert.equal(await hasPermission(userId, PERMISSIONS.ADMIN_ACCESS), false);
});

suite.skipUnlessEnabled("returns true once the permission is granted", enabled, async () => {
    const {hasPermission} = getDatabase();
    const userId = await createUser();

    await grant(userId, PERMISSIONS.ADMIN_ACCESS);

    assert.equal(await hasPermission(userId, PERMISSIONS.ADMIN_ACCESS), true);
});

suite.skipUnlessEnabled("grants are independent: each admin permission unlocks only itself", enabled, async () => {
    const {hasPermission} = getDatabase();
    const adminOnly = await createUser();
    const usersOnly = await createUser();

    await grant(adminOnly, PERMISSIONS.ADMIN_ACCESS);
    await grant(usersOnly, PERMISSIONS.ADMIN_USERS_ACCESS);

    assert.equal(await hasPermission(adminOnly, PERMISSIONS.ADMIN_ACCESS), true);
    assert.equal(await hasPermission(adminOnly, PERMISSIONS.ADMIN_USERS_ACCESS), false);
    assert.equal(await hasPermission(usersOnly, PERMISSIONS.ADMIN_USERS_ACCESS), true);
    assert.equal(await hasPermission(usersOnly, PERMISSIONS.ADMIN_ACCESS), false);
});

suite.skipUnlessEnabled("grants are per user: one user's grant does not apply to another", enabled, async () => {
    const {hasPermission} = getDatabase();
    const holder = await createUser();
    const other = await createUser();

    await grant(holder, PERMISSIONS.ADMIN_ACCESS);

    assert.equal(await hasPermission(holder, PERMISSIONS.ADMIN_ACCESS), true);
    assert.equal(await hasPermission(other, PERMISSIONS.ADMIN_ACCESS), false);
});

suite.skipUnlessEnabled("revoking a grant takes effect immediately", enabled, async () => {
    const {db, userPermission, hasPermission, and, eq} = getDatabase();
    const userId = await createUser();
    await grant(userId, PERMISSIONS.ADMIN_ACCESS);
    assert.equal(await hasPermission(userId, PERMISSIONS.ADMIN_ACCESS), true);

    await db
        .delete(userPermission)
        .where(and(eq(userPermission.userId, userId), eq(userPermission.permission, PERMISSIONS.ADMIN_ACCESS)));

    assert.equal(await hasPermission(userId, PERMISSIONS.ADMIN_ACCESS), false);
});

suite.skipUnlessEnabled("returns false for a user id that does not exist", enabled, async () => {
    const {hasPermission} = getDatabase();

    assert.equal(await hasPermission(`perm-test-${randomUUID()}`, PERMISSIONS.ADMIN_ACCESS), false);
});

suite.skipUnlessEnabled("rejects a duplicate grant (composite primary key)", enabled, async () => {
    const {db, userPermission} = getDatabase();
    const userId = await createUser();
    await grant(userId, PERMISSIONS.ADMIN_ACCESS);

    await assert.rejects(
        () => db.insert(userPermission).values({userId, permission: PERMISSIONS.ADMIN_ACCESS}),
        (error: { cause?: { code?: string } }) => error.cause?.code === "23505",
    );
});

suite.skipUnlessEnabled("every defined permission can be stored and found, and deleting the user removes the grants", enabled, async () => {
    const {db, user, userPermission, hasPermission, eq} = getDatabase();
    const userId = await createUser();

    for (const permission of Object.values(PERMISSIONS)) {
        await grant(userId, permission);
        assert.equal(await hasPermission(userId, permission), true, `${permission} should round-trip`);
    }

    await db.delete(user).where(eq(user.id, userId));

    const remaining = await db.select().from(userPermission).where(eq(userPermission.userId, userId));
    assert.deepEqual(remaining, [], "grants should cascade-delete with the user");
});

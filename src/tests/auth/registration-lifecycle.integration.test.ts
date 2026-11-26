/**
 * @fileOverview    Verifies pending-registration cancellation and expiry against PostgreSQL.
 * @module          features/auth
 *
 * @remarks         Runs only when TEST_DATABASE_URL is set; otherwise tests are skipped. Apply migrations to the
 *                  isolated test database before running the suite with `npm run test:run`.
 * @remarks         Each test creates uniquely named rows and removes its fixtures afterwards.
 */

import "dotenv/config";
import {user} from "@/lib/db/auth/schema";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {after} from "node:test";

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
const enabled = Boolean(TEST_DATABASE_URL);

if (TEST_DATABASE_URL) {
    const databaseName = decodeURIComponent(new URL(TEST_DATABASE_URL).pathname.replace(/^\//, ""));
    if (!databaseName.endsWith("_test")) {
        throw new Error('Refusing integration tests: TEST_DATABASE_URL database name must end in "_test".');
    }
}

async function loadDatabase() {
    if (!TEST_DATABASE_URL) throw new Error("TEST_DATABASE_URL is required.");
    process.env.DATABASE_URL = TEST_DATABASE_URL;

    const [{db}, schema, {eq, inArray}] = await Promise.all([
        import("@/lib/db/auth/db"),
        import("@/lib/db/auth/schema"),
        import("drizzle-orm"),
    ]);
    const [{cancelPendingRegistration}, {cleanupExpiredUnverifiedAccounts}] = await Promise.all([
        import("@/features/auth/server/cancel-registration"),
        import("@/features/auth/server/cleanup-unverified-accounts"),
    ]);

    return {db, ...schema, eq, inArray, cancelPendingRegistration, cleanupExpiredUnverifiedAccounts};
}

const database = enabled ? await loadDatabase() : null;
const createdUserIds: string[] = [];
const createdEmails: string[] = [];

function getDatabase() {
    assert.ok(database, "TEST_DATABASE_URL must be set");
    return database;
}

async function createUser(options: { verified?: boolean; createdAt?: Date } = {}) {
    const {db, user} = getDatabase();
    const id = `lifecycle-test-${randomUUID()}`;
    const email = `${id}@test.local`;
    await db.insert(user).values({
        id,
        name: "Registration Lifecycle Test",
        email,
        emailVerified: options.verified ?? false,
        createdAt: options.createdAt ?? new Date(),
    });
    createdUserIds.push(id);
    createdEmails.push(email);
    return {id, email};
}

async function addRegistrationRecords(userId: string, email: string) {
    const {
        db,
        session,
        account,
        verification,
        emailVerificationResend,
        revokedVerificationToken,
        userPermission
    } = getDatabase();
    const now = new Date();
    const suffix = randomUUID();

    await db.insert(session).values({
        id: `session-${suffix}`,
        token: `token-${suffix}`,
        userId,
        expiresAt: new Date(now.getTime() + 60_000),
        createdAt: now,
        updatedAt: now,
    });
    await db.insert(account).values({
        id: `account-${suffix}`,
        accountId: userId,
        providerId: "credential",
        userId,
        createdAt: now,
        updatedAt: now,
    });
    await db.insert(verification).values({
        id: `verification-${suffix}`,
        identifier: email,
        value: "test-verification-value",
        expiresAt: new Date(now.getTime() + 60_000),
    });
    await db.insert(emailVerificationResend).values({userId, attempts: 1, windowStartedAt: now});
    await db.insert(revokedVerificationToken).values({
        tokenHash: `hash-${suffix}`,
        userId,
        expiresAt: new Date(now.getTime() + 60_000),
    });
    await db.insert(userPermission).values({userId, permission: "admin.access"});
}

after(async () => {
    if (!database) return;
    const {db, verification, inArray} = database;
    if (createdEmails.length > 0) {
        await db.delete(verification).where(inArray(verification.identifier, createdEmails));
    }
    if (createdUserIds.length > 0) {
        await db.delete(user).where(inArray(user.id, createdUserIds));
    }
    await db.$client.end();
});

const suite = new Suite("auth/registration-lifecycle (database)", 4);

suite.skipUnlessEnabled("cancellation deletes only the pending user and all registration-owned records", enabled, async () => {
    const {
        db, user, session, account, verification, emailVerificationResend, revokedVerificationToken, userPermission,
        cancelPendingRegistration, eq
    } = getDatabase();
    const fixture = await createUser();
    await addRegistrationRecords(fixture.id, fixture.email);

    assert.equal(await cancelPendingRegistration(fixture.id), true);
    assert.deepEqual(await db.select().from(user).where(eq(user.id, fixture.id)), []);
    assert.deepEqual(await db.select().from(session).where(eq(session.userId, fixture.id)), []);
    assert.deepEqual(await db.select().from(account).where(eq(account.userId, fixture.id)), []);
    assert.deepEqual(await db.select().from(emailVerificationResend).where(eq(emailVerificationResend.userId, fixture.id)), []);
    assert.deepEqual(await db.select().from(revokedVerificationToken).where(eq(revokedVerificationToken.userId, fixture.id)), []);
    assert.deepEqual(await db.select().from(userPermission).where(eq(userPermission.userId, fixture.id)), []);
    assert.deepEqual(await db.select().from(verification).where(eq(verification.identifier, fixture.email)), []);
});

suite.skipUnlessEnabled("cancellation refuses to delete a verified account", enabled, async () => {
    const {db, user, cancelPendingRegistration, eq} = getDatabase();
    const fixture = await createUser({verified: true});

    assert.equal(await cancelPendingRegistration(fixture.id), false);
    assert.equal((await db.select({id: user.id}).from(user).where(eq(user.id, fixture.id))).length, 1);
});

suite.skipUnlessEnabled("expiry cleanup deletes old unverified accounts and cascades registration records", enabled, async () => {
    const {
        db,
        user,
        emailVerificationResend,
        revokedVerificationToken,
        verification,
        cleanupExpiredUnverifiedAccounts,
        eq
    } = getDatabase();
    const now = new Date("2026-11-26T12:00:00.000Z");
    const expired = await createUser({createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)});
    await addRegistrationRecords(expired.id, expired.email);
    const originalTtl = process.env.UNVERIFIED_ACCOUNT_TTL_DAYS;
    process.env.UNVERIFIED_ACCOUNT_TTL_DAYS = "7";

    try {
        const result = await cleanupExpiredUnverifiedAccounts(now);
        assert.equal(result.deletedCount, 1);
        assert.equal(result.hasMore, false);
        assert.deepEqual(await db.select().from(user).where(eq(user.id, expired.id)), []);
        assert.deepEqual(await db.select().from(emailVerificationResend).where(eq(emailVerificationResend.userId, expired.id)), []);
        assert.deepEqual(await db.select().from(revokedVerificationToken).where(eq(revokedVerificationToken.userId, expired.id)), []);
        assert.deepEqual(await db.select().from(verification).where(eq(verification.identifier, expired.email)), []);
    } finally {
        if (originalTtl === undefined) delete process.env.UNVERIFIED_ACCOUNT_TTL_DAYS;
        else process.env.UNVERIFIED_ACCOUNT_TTL_DAYS = originalTtl;
    }
});

suite.skipUnlessEnabled("expiry cleanup preserves verified and not-yet-expired accounts", enabled, async () => {
    const {db, user, cleanupExpiredUnverifiedAccounts, eq} = getDatabase();
    const now = new Date("2026-11-26T12:00:00.000Z");
    const verified = await createUser({verified: true, createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)});
    const recent = await createUser({createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)});
    const originalTtl = process.env.UNVERIFIED_ACCOUNT_TTL_DAYS;
    process.env.UNVERIFIED_ACCOUNT_TTL_DAYS = "7";

    try {
        const result = await cleanupExpiredUnverifiedAccounts(now);
        assert.equal(result.deletedCount, 0);
        assert.equal((await db.select({id: user.id}).from(user).where(eq(user.id, verified.id))).length, 1);
        assert.equal((await db.select({id: user.id}).from(user).where(eq(user.id, recent.id))).length, 1);
    } finally {
        if (originalTtl === undefined) delete process.env.UNVERIFIED_ACCOUNT_TTL_DAYS;
        else process.env.UNVERIFIED_ACCOUNT_TTL_DAYS = originalTtl;
    }
});

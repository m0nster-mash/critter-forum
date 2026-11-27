/**
 * @fileOverview    Inserts deterministic, non-authenticating fixtures into the isolated test database.
 * @module          core-application
 */

import {getTestDatabaseUrl} from "./test-database";

/** Stable fixture identities for integration tests and local inspection. */
const fixtures = [
    {id: "fixture-test-user", name: "Integration Test User", email: "integration-user@test.local"},
    {id: "fixture-test-admin", name: "Integration Test Administrator", email: "integration-admin@test.local"},
] as const;

/** Seeds repeatable fixture users and administrator permissions. */
async function main(): Promise<void> {
    const testUrl = getTestDatabaseUrl();
    process.env.DATABASE_URL = testUrl;

    const [{db}, {user, userPermission}, {PERMISSIONS}] = await Promise.all([
        import("@/lib/db/auth/db"),
        import("@/lib/db/auth/schema"),
        import("@/features/admin/permissions/constants/permissions"),
    ]);

    try {
        for (const fixture of fixtures) {
            await db.insert(user).values({
                ...fixture,
                emailVerified: true,
            }).onConflictDoUpdate({
                target: user.id,
                set: {name: fixture.name, email: fixture.email, emailVerified: true},
            });
        }

        await db.insert(userPermission).values(
            Object.values(PERMISSIONS).map((permission) => ({
                userId: "fixture-test-admin",
                permission,
            })),
        ).onConflictDoNothing();

        process.stdout.write("Test fixtures are ready.\\n");
    } finally {
        await db.$client.end();
    }
}

main().catch((error: unknown) => {
    process.stderr.write(`Test fixture seeding failed: ${String(error)}\\n`);
    process.exitCode = 1;
});

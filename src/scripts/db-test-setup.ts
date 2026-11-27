/**
 * @fileOverview    Applies pending migrations to TEST_DATABASE_URL and populates deterministic test fixtures.
 * @module          core-application
 */

import {testDatabaseEnvironment} from "@/lib/db/test/test-database";
import {spawnSync} from "node:child_process";

/** Applies Drizzle migrations and seeds the isolated test database. */
function main(): void {
    const env = testDatabaseEnvironment();
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const migration = spawnSync(
        npm,
        ["run", "db:migrate"],
        {
            stdio: "inherit",
            env,
            shell: process.platform === "win32"
        });
    if (migration.status !== 0) {
        process.exitCode = migration.status ?? 1;
        return;
    }

    const seed = spawnSync(
        npm,
        ["run", "db:test:seed"],
        {
            stdio: "inherit",
            env,
            shell: process.platform === "win32"
        });
    process.exitCode = seed.status ?? 1;
}

try {
    main();
} catch (error) {
    process.stderr.write(`${String(error)}\\n`);
    process.exitCode = 1;
}

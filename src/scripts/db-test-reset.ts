/**
 * @fileOverview    Destructively resets only the isolated test database, then migrates and seeds it.
 * @module          core-application
 */

import {Pool} from "pg";
import {spawnSync} from "node:child_process";
import {getTestDatabaseUrl, testDatabaseEnvironment} from "@/lib/db/test/test-database";

/** Drops and recreates the public schema after validating the target database name. */
async function resetSchema(): Promise<void> {
    const connectionString = getTestDatabaseUrl();
    const pool = new Pool({connectionString});
    try {
        await pool.query("DROP SCHEMA IF EXISTS public CASCADE");
        await pool.query("CREATE SCHEMA public");
    } finally {
        await pool.end();
    }
}

/** Resets, migrates, and seeds the test database. */
async function main(): Promise<void> {
    const env = testDatabaseEnvironment();
    await resetSchema();

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

main().catch((error: unknown) => {
    process.stderr.write(`Test database reset failed: ${String(error)}\\n`);
    process.exitCode = 1;
});

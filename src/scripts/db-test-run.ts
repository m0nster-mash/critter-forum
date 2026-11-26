/**
 * @fileOverview    Runs the complete Node test suite with DATABASE_URL pinned to TEST_DATABASE_URL.
 * @module          core-application
 */

import {spawnSync} from "node:child_process";
import {testDatabaseEnvironment} from "@/lib/db/test/test-database";

/** Runs tests with the isolated test database as the only database target. */
function main(): void {
    const env = testDatabaseEnvironment();
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const result = spawnSync(
        npm,
        ["run", "test:run"],
        {
            stdio: "inherit",
            env,
            shell: process.platform === "win32"
        });
    process.exitCode = result.status ?? 1;
}

try {
    main();
} catch (error) {
    process.stderr.write(`${String(error)}\\n`);
    process.exitCode = 1;
}

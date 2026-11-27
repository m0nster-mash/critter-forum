/**
 * @fileOverview    Validates that database maintenance commands target only the isolated test database.
 * @module          core-application
 */

import "dotenv/config";

/** Validated test database connection string. */
export function getTestDatabaseUrl(): string {
    const testUrl = process.env.TEST_DATABASE_URL;
    if (!testUrl) {
        throw new Error("TEST_DATABASE_URL is required. Set it to the dedicated PostgreSQL test database.");
    }

    let test: URL;
    try {
        test = new URL(testUrl);
    } catch {
        throw new Error("TEST_DATABASE_URL must be a valid PostgreSQL connection URL.");
    }

    const databaseName = decodeURIComponent(test.pathname.replace(/^\//, ""));
    if (!databaseName.endsWith("_test")) {
        throw new Error(`Refusing database operation: TEST_DATABASE_URL database "${databaseName}" must end in "_test".`);
    }

    const developmentUrl = process.env.DATABASE_URL;
    if (developmentUrl && developmentUrl === testUrl) {
        throw new Error("Refusing database operation: TEST_DATABASE_URL must differ from DATABASE_URL.");
    }

    return testUrl;
}

/** Returns a child-process environment pinned to the validated test database. */
export function testDatabaseEnvironment(): NodeJS.ProcessEnv {
    const url = getTestDatabaseUrl();
    return {...process.env, TEST_DATABASE_URL: url, DATABASE_URL: url};
}

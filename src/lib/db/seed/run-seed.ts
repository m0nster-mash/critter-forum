/**
 * @fileOverview    Runs the database seed tasks and reports their outcome.
 * @module          core-application
 */

import "dotenv/config";
import {logger} from "@/features/alerts/server/logger";
import {seedUsers} from "./seed-users";

/** Logger instance bound to the database seeding scope. */
const log = logger.child({scope: "seed"});

/** Runs the database seeder. */
async function main() {
    try {
        log.info("Starting database seed runner...");
        await seedUsers();
        log.info("All database seeds completed successfully.");
        process.exit(0);
    } catch (error) {
        log.error("Seeding failed.", {err: error});
        process.exit(1);
    }
}

main();

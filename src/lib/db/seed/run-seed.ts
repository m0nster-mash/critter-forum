/**
 * @fileOverview    TODO: document
 *
 * @module lib/db/seed/run-seed
 * @status Requires documentation
 */

import "dotenv/config";
import {logger} from "@/features/alerts/server/logger";
import {seedUsers} from "./seed-users";

/** TODO: document */
const log = logger.child({scope: "seed"});

/**
 * runs the database seeder.
 */
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

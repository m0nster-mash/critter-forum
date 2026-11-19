import "dotenv/config";
import {LOG_SCOPES} from "@/lib/alerts/constants/observability";
import {logger} from "@/lib/alerts/server/logger";
import {seedUsers} from "./seed-users";

const log = logger.child({scope: LOG_SCOPES.SEED});

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

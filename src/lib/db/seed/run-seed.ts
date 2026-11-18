import "dotenv/config";
import {seedUsers} from "./seed-users";

/**
 * runs the database seeder.
 */
async function main() {
    try {
        console.log("Starting database seed runner...\n");
        await seedUsers();
        console.log("\nAll database seeds completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed with error:", error);
        process.exit(1);
    }
}

main();

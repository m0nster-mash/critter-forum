import {LOG_SCOPES} from "@/features/alerts/constants/observability";
import {logger} from "@/features/alerts/server/logger";
import {auth} from "@/lib/db/auth/auth";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";

const log = logger.child({scope: LOG_SCOPES.SEED});

const TEST_PASSWORD = "password00";

const seedUsersData = [
    {
        name: "Test User",
        email: "user@test.local",
        password: TEST_PASSWORD,
    },
    {
        name: "Administrator",
        email: "admin@test.local",
        password: TEST_PASSWORD,
    },
] as const;

/**
 * Configures users for the database seeder.
 */
export async function seedUsers(): Promise<void> {
    log.info("Seeding users...");

    for (const seedUser of seedUsersData) {
        const [existingUser] = await db
            .select({id: user.id})
            .from(user)
            .where(eq(user.email, seedUser.email))
            .limit(1);

        if (existingUser) {
            log.info("User already exists; skipping.", {email: seedUser.email});
            continue;
        }

        await auth.api.signUpEmail({
            body: {
                name: seedUser.name,
                email: seedUser.email,
                password: seedUser.password,
            },
        });

        log.info("Created user.", {email: seedUser.email});
    }

    log.info("User seeding complete.");
}

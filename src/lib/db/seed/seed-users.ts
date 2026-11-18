import {auth} from "@/lib/db/auth/auth";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";



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

export async function seedUsers(): Promise<void> {
    console.info("Seeding users...");

    for (const seedUser of seedUsersData) {
        const [existingUser] = await db
            .select({id: user.id})
            .from(user)
            .where(eq(user.email, seedUser.email))
            .limit(1);

        if (existingUser) {
            console.info(`User already exists; skipping: ${seedUser.email}`)
            continue;
        }

        await auth.api.signUpEmail({
            body: {
                name: seedUser.name,
                email: seedUser.email,
                password: seedUser.password,
            },
        });

        console.info(`Created user: ${seedUser.email}`);
    }

    console.info("User seeding complete.");
}

import {db} from "@/lib/db/auth/db";
import {drizzleAdapter} from "@better-auth/drizzle-adapter";
import {betterAuth} from "better-auth";

/**
 * Separates the auth configuration separate from the database connection, application modules, and route handlers.
 */
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
});

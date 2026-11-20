import "dotenv/config";
import {defineConfig} from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/db/auth/schema.ts", // TODO:: change this dir path
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});

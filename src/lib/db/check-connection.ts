import "dotenv/config";

import {sql} from "drizzle-orm";
import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set");
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const db = drizzle({client: pool});
        await db.execute(sql`select 1`);
        console.log("Database connection successful.");
    } finally {
        await pool.end();
    }
}

main().catch((error) => {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
});

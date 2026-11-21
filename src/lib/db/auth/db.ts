/**
 * TODO: document
 *
 * @module lib/db/auth/db
 * @status Requires documentation
 */

import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import * as schema from "./schema";

/**
 * PostgreSQL connection pool and Drizzle ORM instance initialized using environment database configuration.
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/** TODO: document */
export const db = drizzle(pool, {schema});

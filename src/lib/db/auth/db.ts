/**
 * @fileOverview    Initializes the PostgreSQL connection pool and Drizzle database client.
 * @module          core-application
 */

import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import * as schema from "./schema";

/** PostgreSQL connection pool and Drizzle ORM instance initialized using environment database configuration. */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/** Provides the db functionality. */
export const db = drizzle(pool, {schema});

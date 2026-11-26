/**
 * @fileOverview    Grants permissions to the development users created by the user seeder.
 * @module          core-application
 */

import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {logger} from "@/features/alerts/server/logger";
import {db} from "@/lib/db/auth/db";
import {user, userPermission} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";

/** Logger instance bound to the database seeding scope. */
const log = logger.child({scope: "seed"});

/**
 * Permissions granted to each seed user, keyed by email.
 *
 * @remarks     The administrator receives every defined permission, so new permissions work in development without
 *              touching this file.
 */
const seedPermissionsData = [
    {
        email: "admin@test.local",
        permissions: Object.values(PERMISSIONS),
    },
] as const;

/** Grants permissions to the seeded users. Safe to re-run. */
export async function seedPermissions(): Promise<void> {
    log.info("Seeding permissions...");

    for (const seedGrant of seedPermissionsData) {
        const [existingUser] = await db
            .select({id: user.id})
            .from(user)
            .where(eq(user.email, seedGrant.email))
            .limit(1);

        if (!existingUser) {
            log.warn("User not found; skipping permission grants.", {email: seedGrant.email});
            continue;
        }

        await db
            .insert(userPermission)
            .values(seedGrant.permissions.map((permission) => ({userId: existingUser.id, permission})))
            .onConflictDoNothing();

        log.info("Granted permissions.", {email: seedGrant.email, permissions: seedGrant.permissions});
    }

    log.info("Permission seeding complete.");
}

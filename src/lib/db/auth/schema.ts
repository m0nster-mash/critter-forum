/**
 * @fileOverview    Defines the Drizzle tables and relations used by the authentication database.
 * @module          core-application
 */

// Type-only import: drizzle-kit loads this file without resolving the `@/` alias, so no runtime imports from `@/`.
import type {Permission} from "@/features/admin/permissions/constants/permissions";
import {relations} from "drizzle-orm";
import {boolean, index, pgTable, primaryKey, text, timestamp} from "drizzle-orm/pg-core";

/** Provides the user functionality. */
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

/** Provides the session functionality. */
export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

/** Provides the account functionality. */
export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

/** Provides the verification functionality. */
export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/**
 * Permissions granted directly to a user, one row per grant.
 *
 * @remarks     The permissions themselves are defined in code (`features/admin/permissions`), not in the database, so
 *              adding a permission needs no migration.
 * @remarks     The composite primary key prevents duplicate grants and covers lookups by user.
 */
export const userPermission = pgTable(
    "user_permission",
    {
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        permission: text("permission").$type<Permission>().notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [primaryKey({columns: [table.userId, table.permission]})],
);

/** Provides the userRelations functionality. */
export const userRelations = relations(user, ({many}) => ({
    sessions: many(session),
    accounts: many(account),
    permissions: many(userPermission),
}));

/** Provides the sessionRelations functionality. */
export const sessionRelations = relations(session, ({one}) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

/** Provides the accountRelations functionality. */
export const accountRelations = relations(account, ({one}) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

/** Provides the userPermissionRelations functionality. */
export const userPermissionRelations = relations(userPermission, ({one}) => ({
    user: one(user, {
        fields: [userPermission.userId],
        references: [user.id],
    }),
}));

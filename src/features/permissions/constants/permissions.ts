/**
 * @fileOverview    Defines every permission that can be granted to a user.
 * @module          features/permissions
 */

/**
 * Stable identifiers for permissions.
 *
 * @remarks     Each permission is independent: holding one never implies another (ex. `admin.users.access` does not
 *              require `admin.access`).
 * @remarks     Values are stored as text in `user_permission.permission`, so they are persistent. Never rename or
 *              reuse one without migrating the stored rows.
 * @remarks     Naming convention: `area.resource.action` in lowercase, with the constant key mirroring it.
 */
export const PERMISSIONS = {
    ADMIN_ACCESS: "admin.access",
    ADMIN_USERS_ACCESS: "admin.users.access",
} as const;

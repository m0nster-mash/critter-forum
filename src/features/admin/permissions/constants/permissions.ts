/**
 * @fileOverview    Defines every permission that can be granted to a user.
 * @module          features/admin/permissions
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
    ADMIN_USERS_EDIT: "admin.users.edit",
} as const;
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * TODO     Document
 */
export const PERMISSION_DEFINITIONS = [
    {
        key: PERMISSIONS.ADMIN_ACCESS,
        label: "Admin Dashboard",
        description: "View the admin dashboard.",
    },
    {
        key: PERMISSIONS.ADMIN_USERS_ACCESS,
        label: "View Users",
        description: "View the user list.",
    },
    {
        key: PERMISSIONS.ADMIN_USERS_EDIT,
        label: "Manage User",
        description: "Manage user data.",
    },
] as const satisfies {
    key: Permission;
    label: string;
    description: string;
}[];

/**
 * TODO:: document
 *
 * TODO     This is never in use; delete?
 *
 * @param   value   TODO:: document
 */
export function isPermission(
    value: string,
): value is Permission {
    return PERMISSION_DEFINITIONS.some(
        (permission) => permission.key === value,
    );
}

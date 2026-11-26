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

/**
 * Union of every valid permission string.
 *
 * @remarks     Derived from `PERMISSIONS` so the type and the canonical identifier list stay in sync.
 */
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Human-readable labels and descriptions for every defined permission.
 *
 * @remarks     Used by the admin permission-management UI to render each grant to administrators.
 * @remarks     Each `key` must match a value in `PERMISSIONS`;
 *              the `satisfies` constraint enforces this at compile time
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
 * Type guard that checks whether a string is a defined permission key.
 *
 * @remarks     Compares the value against every entry in `PERMISSION_DEFINITIONS`.
 * @remarks     Returns a type predicate, so a `true` result narrows `string` to `Permission`.
 *
 * @param       value      The string to validate.
 *
 * @returns     {boolean}  `true` when `value` matches a defined permission key.
 *
 * @TODO        This function is never in use; decide whether to keep or delete it.
 */
export function isPermission(
    value: string,
): value is Permission {
    return PERMISSION_DEFINITIONS.some(
        (permission) => permission.key === value,
    );
}

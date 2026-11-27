/**
 * @fileOverview    Defines admin-area type and interface exports
 * @module          features/admin/user-management
 */

/**
 * Input used to update a user's display name through the admin feature.
 *
 * @property userId  Identifier of the user being updated.
 * @property name    Updated username.
 */
export interface UpdateUserInput {
    userId: string;
    name: string;
}

/**
 * Input used to find a user by email, optionally excluding one user.
 *
 * @property email          Email address to look up.
 * @property excludeUserId  User ID to exclude from the lookup.
 */
export interface GetUserByEmailProps {
    email: string;
    excludeUserId?: string;
}

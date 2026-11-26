/**
 * Input used to update a user's editable account details.
 *
 * @property userId  Identifier of the user being updated.
 * @property name    Updated username.
 * @property email   Updated email address.
 */
export interface UpdateUserInput {
    userId: string;
    name: string;
    email: string;
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

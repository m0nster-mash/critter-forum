
/**
 * @fileOverview    Defines shared types for user data used across application features.
 * @module          features/users
 */

/**
 * Essential user attributes required by application views and panels.
 *
 * @remarks     Represents a lightweight user record suitable for display across authenticated and administrative views.
 * @remarks     This is not a complete authentication database record or a registration input contract.
 *
 * @property    id      Unique identifier of the user.
 * @property    name    Display name of the user.
 * @property    email   Email address associated with the user.
 */
export interface UserSummary {
    id: string;
    name: string;
    email: string;
}

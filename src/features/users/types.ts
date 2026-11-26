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

/**
 * Props shared by the current user's settings panels.
 */
export interface UserSettingsPanelProps {
    user: UserSummary;
}

/**
 * Input used to validate a password change.
 */
export interface PasswordChangeInput {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Props for the profile page panel.
 *
 * @remarks     This is deliberately distinct from `DashboardPageProps`: profile rendering has its own component
 *              contract and may evolve independently even though both currently carry a user summary.
 *
 * @property    user    User whose public/profile details are being displayed.
 */
export interface UserProfileProps {
    user: UserSummary;
}

/**
 * Props for the profile page route/view when its dynamic segment is still represented as an asynchronous params value.
 *
 * @remarks     Next.js page props expose `params` as a promise in this project. Keep this route-level shape separate
 *              from feature-level resolved identifiers such as `UserIdParams`.
 *
 * @property    params  Promise resolving to the route's dynamic user identifier.
 */
export interface UserProfilePageProps {
    params: Promise<{ userId: string }>;
}

/**
 * Minimal user identity and contact data shared by user-facing panels.
 *
 * @remarks     This is a UI/read-model shape, not a database row, authentication session, or authorization record.
 *              Add fields only when they are safe and useful across the consumers listed below. Use feature-local
 *              types for richer admin or server-only user records.
 *
 * @property    id      Stable user identifier.
 * @property    name    Display name shown in the interface.
 * @property    email   User email address shown by account and profile interfaces.
 */
export interface UserSummary {
    id: string;
    name: string;
    email: string;
}

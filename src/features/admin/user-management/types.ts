
/**
 * @fileOverview    Defines shared types for the admin user-management feature.
 * @module          features/admin/user-management
 */

import type {UserSummary} from "@/features/users/types";

/**
 * Properties passed into the AdminUserManagementPanel component.
 *
 * @remarks     Provides the collection of user records displayed in the admin user-management table.
 *
 * @property    users   User summary records rendered in the management table.
 */
export interface AdminUserManagementPanelProps {
    users: UserSummary[];
}

/**
 * Properties passed into the AdminEditUserPanel component.
 *
 * @remarks     Provides the selected user's summary data for the admin editing interface.
 *
 * @property    user    User summary record displayed by the edit panel.
 */
export interface AdminEditUserPanelProps {
    user: UserSummary;
}

/**
 * Dynamic route parameters identifying a user-management record.
 *
 * @remarks     Shared by the admin edit view and the user lookup query so both use the same parameter contract.
 *
 * @property    userId  Unique identifier of the user being retrieved or edited.
 */
export interface UserIdParams {
    userId: string;
}

/**
 * Properties accepted by the admin edit-user route page.
 *
 * @remarks     Next.js supplies route parameters asynchronously.
 *
 * @property    params  Promise resolving to the dynamic user route parameters.
 */
export interface AdminEditUserPageProps {
    params: Promise<UserIdParams>;
}

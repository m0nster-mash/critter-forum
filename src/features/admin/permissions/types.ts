/**
 * @fileOverview    Exposes the canonical permission union for the admin permission system.
 * @module          features/admin/permissions
 */

import {UserPropItems} from "@/lib/types";

export type {Permission} from "@/features/admin/permissions/constants/permissions";

/**
 * Property object structure passed into the {@see AdminUserManagementPanel} component.
 *
 * @property    user    User metadata object required for rendering dashboard user UI details.
 */
export interface UserManagementPageProps {
    users: UserPropItems[];
}

/**
 * Property object structure passed into the {@see AdminEditUserPanel} component.
 *
 * @property    user    User metadata object required for rendering dashboard user UI details.
 */
export interface UserEditPageProps {
    user: UserPropItems;
}

/**
 * TODO:: document
 */
export type UserIdParams = {
    userId: string;
};

/**
 * Property object structure passed into the {@see AdminEditUserView}.
 */
export interface AdminEditUserViewProps extends UserIdParams {}

/**
 * TODO:: document
 */
export interface GetSelectedUserProps extends UserIdParams {}

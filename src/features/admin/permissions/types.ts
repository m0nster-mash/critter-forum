/**
 * @fileOverview    Exposes the canonical permission union for the admin permission system.
 * @module          features/admin/permissions
 */

import {UserPropItems} from "@/lib/types";

export type {Permission} from "@/features/admin/permissions/constants/permissions";

/**
 * Property object structure passed into the {@link DashboardPagePanel} component.
 *
 * @property    user    User metadata object required for rendering dashboard user UI details.
 */
export interface UserManagementPageProps {
    users: UserPropItems[];
}

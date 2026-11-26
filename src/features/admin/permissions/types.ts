/**
 * @fileOverview    Defines admin permission exports and user-management contracts used by admin views and queries.
 * @module          features/admin/permissions
 *
 * @remarks         Permission identifiers are defined canonically in `constants/permissions.ts`; this file re-exports
 *                  that union and owns only the admin-facing contracts consumed by the permission/user-management
 *                  feature.
 */

import {UserSummary} from "@/features/users/types";

export type {Permission} from "@/features/admin/permissions/constants/permissions";

/**
 * Props for the admin user-management panel.
 *
 * @remarks     Supply the user summaries selected for the management table. This is a view contract only; permission
 *              grants and mutation capabilities are enforced independently by server actions.
 *
 * @property    users   Users to display in the management interface.
 */
export interface UserManagementPageProps {
    users: UserSummary[];
}

/**
 * Props for the admin edit-user panel.
 *
 * @remarks     Use when the panel receives the selected user record as data. This differs from
 *              `AdminEditUserViewProps`, which receives only an identifier and resolves the user itself.
 *
 * @property    user    User summary being edited.
 */
export interface UserEditPageProps {
    user: UserSummary;
}

/**
 * Resolved identifier used by admin user queries and view components.
 *
 * @remarks     This is the plain, synchronous form of the dynamic route value. Use it after awaiting Next.js page
 *              params or when calling a query that accepts a user ID.
 *
 * @property    userId  Identifier of the target user.
 */
export interface UserIdParams {
    userId: string;
}

/**
 * Props for the admin edit-user view, which resolves its user from an identifier.
 *
 * @remarks     Extends the resolved route identifier rather than embedding a user record. Use this at the view
 *              boundary when the view is responsible for loading the selected user.
 */
export interface AdminEditUserViewProps extends UserIdParams {
}

/**
 * Input for selecting/loading a user in the admin query layer.
 *
 * @remarks     Kept as a named query contract so query call sites describe intent rather than passing an anonymous
 *              object. It intentionally remains distinct from view props even though both currently contain `userId`.
 */
export interface GetSelectedUserProps extends UserIdParams {
}

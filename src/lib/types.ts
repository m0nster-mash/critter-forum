/**
 * @fileOverview    Defines shared presentation and user-data contracts used across application features.
 * @module          core-application
 *
 * @remarks         Keep only genuinely cross-feature contracts here. Feature-specific props belong in their feature's
 *                  own `types.ts` file, even when their structure resembles a type defined elsewhere.
 */

import type {ReactNode} from "react";

/**
 * A single breadcrumb entry in a page-navigation trail.
 *
 * @remarks     This is a presentation contract, not a route definition. Use `href` only when the crumb is navigable;
 *              omit it for the current page or another non-interactive label.
 *
 * @property    label       Text displayed for this breadcrumb.
 * @property    [href]      Optional destination. When omitted, render the label as plain text.
 *
 * @see         `Breadcrumbs` in `src/components/ui/breadcrumbs.tsx`.
 * @see         `PageHeaderProps` in this file.
 */
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

/**
 * Props for the shared page-header component.
 *
 * @remarks     Use for page-level headings that may include a breadcrumb trail. Feature-specific page metadata should
 *              be adapted to this presentation contract rather than added here.
 *
 * @property    title           Required title content; React nodes are accepted for composed headings.
 * @property    [breadcrumb]    Optional ordered breadcrumb entries.
 *
 * @see         `PageHeader` in `src/components/ui/page-header.tsx`.
 */
export interface PageHeaderProps {
    title: ReactNode;
    breadcrumb?: BreadcrumbItem[];
}

/**
 * Props for the shared breadcrumbs component.
 *
 * @remarks     Use when rendering breadcrumbs independently of `PageHeader`. The list is required so the component
 *              never has to infer navigation state.
 *
 * @property    breadcrumb  Ordered entries to render in the navigation trail.
 *
 * @see         `Breadcrumbs` in `src/components/ui/breadcrumbs.tsx`.
 */
export interface BreadcrumbProps {
    breadcrumb: BreadcrumbItem[];
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
 *
 * @see         `DashboardPageProps`, `AccountSettingsProps`, and `UserProfileProps` in this file.
 * @see         `UserManagementPageProps` in `src/features/admin/permissions/types.ts`.
 */
export interface UserSummary {
    id: string;
    name: string;
    email: string;
}

/**
 * @deprecated Use {@link UserSummary}. Retained as a compatibility alias for consumers outside this repository snapshot.
 *
 * @remarks     Do not use this legacy name in new code; migrate imports to `UserSummary`.
 */
export type UserPropItems = UserSummary;

/**
 * Props for the dashboard page panel.
 *
 * @remarks     Use at the view/panel boundary after the server has selected the user summary to display. Do not pass a
 *              Better Auth session or raw database record directly.
 *
 * @property    user    User identity and contact details for the dashboard.
 *
 * @see         `DashboardPagePanel` in `src/components/panels/dashboard-page-panel.tsx`.
 */
export interface DashboardPageProps {
    user: UserSummary;
}

/**
 * Props for account-settings panels that edit the current user's own account.
 *
 * @remarks     Shared by the profile-details and account-password panels. Keep the payload to the common user summary;
 *              form-specific values and mutation state belong in each panel's local props.
 *
 * @property    user    Current user's identity and contact details.
 *
 * @see         `ManageAccountPasswordPanel` and `ManageProfileDetailsPanel` in `src/components/panels/`.
 */
export interface AccountSettingsProps {
    user: UserSummary;
}

/**
 * Props for the profile page panel.
 *
 * @remarks     This is deliberately distinct from `DashboardPageProps`: profile rendering has its own component
 *              contract and may evolve independently even though both currently carry a user summary.
 *
 * @property    user    User whose public/profile details are being displayed.
 *
 * @see         `ProfilePagePanel` in `src/components/panels/profile-page-panel.tsx`.
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
 *
 * @see         `UserProfilePage` in `src/app/(dashboard)/profile/[userId]/page.tsx`.
 * @see         `ProfilePageView` in `src/components/views/profile-page-view.tsx`.
 */
export interface UserProfilePageProps {
    params: Promise<{userId: string}>;
}

/**
 * @fileOverview    Defines shared types for alerts, logging, action results, and toast notifications.
 * @module          core-application
 */

import {ReactNode} from "react";

/**
 * Properties for the PageHeader object.
 *
 * @property    title           The page's title rendered inside the header
 * @property    [breadcrumb]    Optional array of breadcrumb items for the navigation trail
 */
export interface PageHeaderProps {
    title: ReactNode;
    breadcrumb?: BreadcrumbItem[];
}

/**
 * Properties for the Breadcrumbs component.
 *
 * @property    breadcrumb  Array of breadcrumb items to render
 */
export interface BreadcrumbProps {
    breadcrumb: BreadcrumbItem[];
}

/**
 * Represents a single breadcrumb item in the navigation trail.
 *
 * @property    label   The display text for the breadcrumb item
 * @property    [href]  Optional; the URL to navigate to when the item is clicked. If omitted, the item is rendered as
 *                      plain text without a link.
 */
export type BreadcrumbItem = {
    label: string;
    href?: string;
};

/**
 * Property object structure passed into the {@link DashboardPagePanel} component.
 *
 * @property    user    User metadata object required for rendering dashboard user UI details.
 */
export interface DashboardPageProps {
    user: UserPropItems;
}

/**
 * Essential user profile attributes required by view panels.
 *
 * @property    name    The display name of the authenticated user.
 */
export type UserPropItems = {
    id: string;
    name: string;
    email: string;
}

export interface AccountSettingsProps{
    user: UserPropItems;
}


export interface UserProfilePageProps {
    params: Promise<{ userId: string }>;
}

export interface UserProfileProps {
    user: UserPropItems;
}


export interface UserIdProps {
    id: string;
}

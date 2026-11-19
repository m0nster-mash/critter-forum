import {ReactNode} from "react";

/**
 * Properties for the PageHeader object.
 *
 * @property    {ReactNode}         title           The page's title rendered inside the header
 * @property    {BreadcrumbItem[]}  [breadcrumb]    Optional array of breadcrumb items for the navigation trail
 */
export interface PageHeaderProps {
    title: ReactNode;
    breadcrumb?: BreadcrumbItem[];
}

/**
 * Properties for the Breadcrumbs component.
 *
 * @property    {BreadcrumbItem[]}  [breadcrumb]    Optional array of breadcrumb items to render
 */
export interface BreadcrumbProps {
    breadcrumb: BreadcrumbItem[];
}

/**
 * Represents a single breadcrumb item in the navigation trail.
 *
 * @property    {string}    label   The display text for the breadcrumb item
 * @property    {string}    [href]  Optional; the URL to navigate to when the item is clicked. If omitted, the item is
 *                                  rendered as plain text without a link.
 */
export type BreadcrumbItem = {
    label: string;
    href?: string;
};

/**
 * Property object structure passed into the DashboardPagePanel component.
 *
 * @property    {UserPropItems} user    User metadata object required for rendering dashboard user UI details.
 */
export interface DashboardPageProps {
    user: UserPropItems;
}

/**
 * Essential user profile attributes required by view panels.
 *
 * @property    {string}    name    The display name of the authenticated user.
 */
export type UserPropItems = {
    name: string;
}

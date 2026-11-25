
/**
 * @fileOverview    Defines shared types for application navigation and page header components.
 * @module          components/ui
 */

import type {ReactNode} from "react";

/**
 * Represents a single breadcrumb item in the navigation trail.
 *
 * @remarks     An item without a href is rendered as plain text rather than a navigable link.
 *
 * @property    label   Display text for the breadcrumb item.
 * @property    [href]  Optional; URL to navigate to when the breadcrumb item is clicked.
 */
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

/**
 * Properties accepted by the Breadcrumbs component.
 *
 * @remarks     Supplies the ordered breadcrumb items used to render the current navigation hierarchy.
 *
 * @property    breadcrumb   Ordered breadcrumb items to render.
 */
export interface BreadcrumbProps {
    breadcrumb: BreadcrumbItem[];
}

/**
 * Properties accepted by the PageHeader component.
 *
 * @remarks     Provides the page title and optional breadcrumb navigation displayed above page content.
 *
 * @property    title           Page title content rendered inside the header.
 * @property    [breadcrumb]    Optional; breadcrumb items representing the current route hierarchy.
 */
export interface PageHeaderProps {
    title: ReactNode;
    breadcrumb?: BreadcrumbItem[];
}

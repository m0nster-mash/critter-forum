/**
 * @fileOverview    Defines shared types for application navigation and page header components.
 * @module          features/navigation
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

/**
 * Props for the shared breadcrumbs component.
 *
 * @remarks     Use when rendering breadcrumbs independently of `PageHeader`. The list is required so the component
 *              never has to infer navigation state.
 *
 * @property    breadcrumb  Ordered entries to render in the navigation trail.
 */
export interface BreadcrumbProps {
    breadcrumb: BreadcrumbItem[];
}

/**
 * @fileOverview    Defines route metadata, access levels, and the application route registry.
 * @module          core-application
 */

import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import type {Permission} from "@/features/admin/permissions/types";

/** Access levels supported by application routes. */
export type AccessLevel = "public" | "private" | "admin";

/**
 * Metadata shared by static and parameterized application routes.
 *
 * @property    path            URL path associated with the route.
 * @property    label           Human-readable navigation label for the route.
 * @property    title           Page title associated with the route.
 * @property    accessLevel     Access classification required to visit the route.
 * @property    parent          Optional;   Value used by this parent operation.
 * @property    [permission]    Optional; the permission required to visit the route. Enforced by the page itself with
 *                              `requirePagePermission`.
 */
export interface RouteMetadata {
    path: string | ((params: Record<string, string>) => string);
    label: string;
    title: string;
    accessLevel: AccessLevel;
    parent?: string;
    permission?: Permission;
}

/** Publicly accessible route definitions. */
export const PUBLIC_ROUTES = {
    HOME: {
        path: "/",
        label: "Home",
        title: "Roleplay Community",
        accessLevel: "public",
    } as const satisfies RouteMetadata,

    LOGIN: {
        path: "/login",
        label: "Sign In",
        title: "Sign In",
        accessLevel: "public",
        parent: "HOME",
    } as const satisfies RouteMetadata,

    REGISTER: {
        path: "/register",
        label: "Register",
        title: "Create Account",
        accessLevel: "public",
        parent: "HOME",
    } as const satisfies RouteMetadata,
};

/** Authenticated user routes. */
export const PRIVATE_ROUTES = {
    DASHBOARD: {
        path: "/dashboard",
        label: "Dashboard",
        title: "Your Dashboard",
        accessLevel: "private",
    } as const satisfies RouteMetadata,
};

/** Administrative routes. */
export const ADMIN_ROUTES = {
    DASHBOARD: {
        path: "/admin",
        label: "Admin Dashboard",
        title: "Administration Dashboard",
        accessLevel: "admin",
        permission: PERMISSIONS.ADMIN_ACCESS,
    } as const satisfies RouteMetadata,

    USERS: {
        path: "/admin/users",
        label: "User Management",
        title: "User Management",
        accessLevel: "admin",
        permission: PERMISSIONS.ADMIN_USERS_ACCESS,
    } as const satisfies RouteMetadata,

    USERS_EDIT: {
        path: (params) => `/admin/${params.userId}/edit`,
        label: "Edit User",
        title: "Edit User",
        accessLevel: "admin",
        permission: PERMISSIONS.ADMIN_USERS_EDIT,
    } as const satisfies RouteMetadata,
};

/** Unified registry of all application routes. */
export const ALL_ROUTES = {
    ...PUBLIC_ROUTES,
    ...PRIVATE_ROUTES,
    ...ADMIN_ROUTES,
} as const;

/** Prefix used when a route builder is called without required parameters. */
export const MISSING_ROUTE_PARAMS = "Route requires parameters: " as const;

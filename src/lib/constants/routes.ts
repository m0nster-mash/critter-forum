/**
 * @fileOverview    Defines route metadata, access levels, and the application route registry.
 * @module          core-application
 */

import type {Permission} from "@/features/admin/permissions/constants/permissions";
import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";

/** Access levels supported by application routes. */
export type AccessLevel = "public" | "private" | "admin";

/**
 * Metadata shared by static and parameterized application routes.
 *
 * @property    path            URL path associated with the route.
 * @property    label           Page title associated with the route.
 * @property    accessLevel     Access classification required to visit the route.
 * @property    parent          Optional; value used by this parent operation.
 * @property    [permission]    Optional; the permission required to visit the route. Enforced by the page itself with
 *                              `requirePagePermission`.
 */
export interface RouteMetadata {
    path: string | ((params: Record<string, string>) => string);
    label: string;
    accessLevel: AccessLevel;
    parent?: string;
    permission?: Permission;
}

/** Publicly accessible route definitions. */
export const PUBLIC_ROUTES = {
    HOME: {
        path: "/",
        label: "Home",
        accessLevel: "public",
    } as const satisfies RouteMetadata,

    LOGIN: {
        path: "/login",
        label: "Sign In",
        accessLevel: "public",
        parent: "HOME",
    } as const satisfies RouteMetadata,

    REGISTER: {
        path: "/register",
        label: "Register",
        accessLevel: "public",
        parent: "HOME",
    } as const satisfies RouteMetadata,

    VERIFY_EMAIL: {
        path: "/verify-email",
        label: "Verify your email address",
        accessLevel: "public",
        parent: "REGISTER",
    } as const satisfies RouteMetadata,
};

/** Authenticated user routes. */
export const PRIVATE_ROUTES = {
    VERIFY_EMAIL: {
        path: "/verify-email",
        label: "Verify Email",
        accessLevel: "private",
        parent: "HOME",
    } as const satisfies RouteMetadata,

    DASHBOARD: {
        path: "/dashboard",
        label: "Dashboard",
        accessLevel: "private",
    } as const satisfies RouteMetadata,

    SETTINGS: {
        path: "/settings",
        label: "Settings",
        accessLevel: "private",
        parent: "DASHBOARD",
    } as const satisfies RouteMetadata,

    PROFILE: {
        path: (params) => `/profile/${params.userId}`,
        label: "Profile",
        accessLevel: "private",
        parent: "HOME",
    } as const satisfies RouteMetadata,
};

/** Administrative routes. */
export const ADMIN_ROUTES = {
    DASHBOARD: {
        path: "/admin",
        label: "Administration",
        accessLevel: "admin",
        permission: PERMISSIONS.ADMIN_ACCESS,
    } as const satisfies RouteMetadata,

    USERS_ACCESS: {
        path: "/admin/users",
        label: "User Management",
        accessLevel: "admin",
        permission: PERMISSIONS.ADMIN_USERS_ACCESS,
        parent: "ADMIN_DASHBOARD",
    } as const satisfies RouteMetadata,

    USERS_EDIT: {
        path: (params) => `/admin/users/${params.userId}/edit`,
        label: "Edit User",
        accessLevel: "admin",
        permission: PERMISSIONS.ADMIN_USERS_EDIT,
        parent: "USERS_ACCESS",
    } as const satisfies RouteMetadata,
};

/** Unified registry of all application routes. */
export const ALL_ROUTES = {
    ...PUBLIC_ROUTES,
    ...PRIVATE_ROUTES,
    ...ADMIN_ROUTES,
    ADMIN_DASHBOARD: ADMIN_ROUTES.DASHBOARD,
} as const;

/** Prefix used when a route builder is called without required parameters. */
export const MISSING_ROUTE_PARAMS = "Route requires parameters: " as const;

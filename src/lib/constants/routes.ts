/**
 * TODO: document
 *
 * @module lib/constants/routes
 * @status Requires documentation
 */

/** Access levels supported by application routes. */
export type AccessLevel = "public" | "private" | "admin";

/** Metadata shared by static and parameterized application routes. */
export interface RouteMetadata {
    /** TODO: document */
    path: string | ((params: Record<string, string>) => string);
    /** TODO: document */
    label: string;
    /** TODO: document */
    title: string;
    /** TODO: document */
    accessLevel: AccessLevel;
    /** TODO: document */
    parent?: string;
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
        label: "Join",
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

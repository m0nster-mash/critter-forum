/**
 * Union type representing permissible access levels for application routes.
 */
export type AccessLevel = "public" | "private" | "admin";

/**
 * Interface defining structural metadata and access constraints associated with an application route.
 *
 * @property    {string | Function} path        The static route path string or builder function producing dynamic paths
 * @property    {string}            label       Human-readable navigation menu text label
 * @property    {string}            title       Header or document title associated with the route
 * @property    {AccessLevel}       accessLevel Permission level required to navigate to the route
 * @property    {string}            [parent]    Optional key identifier linking to a parent route
 */
export interface RouteMetadata {
    path: string | ((params: Record<string, string>) => string);
    label: string;
    title: string;
    accessLevel: AccessLevel;
    parent?: string;
}

// ============================================================================
// PUBLIC ROUTES
// ============================================================================
/**
 * Publicly accessible route definitions.
 */
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
}

// ============================================================================
// PRIVATE ROUTES (requires authentication)
// ============================================================================
/**
 * Authenticated user private route definitions.
 */
export const PRIVATE_ROUTES = {
    DASHBOARD: {
        path: "/dashboard",
        label: "Dashboard",
        title: "Your Dashboard",
        accessLevel: "private",
    } as const satisfies RouteMetadata,
}

// ============================================================================
// ADMIN ROUTES (requires admin access)
// ============================================================================
/**
 * Administrative route definitions restricted to admin users.
 */
export const ADMIN_ROUTES = {
    DASHBOARD: {
        path: "/admin",
        label: "Admin Dashboard",
        title: "Administration Dashboard",
        accessLevel: "admin",
    } as const satisfies RouteMetadata,
}

// ============================================================================
// UNIFIED ROUTE REGISTRY
// ============================================================================

/**
 * Unified registry combining all public, private, and administrative route definitions.
 */
export const ALL_ROUTES = {
    ...PUBLIC_ROUTES,
    ...PRIVATE_ROUTES,
    ...ADMIN_ROUTES,
} as const;

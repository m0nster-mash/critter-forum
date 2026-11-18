
/**
 * TODO:: document
 */
export type AccessLevel = "public" | "private" | "admin";

/**
 * TODO:: document
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
 * TODO:: document
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
        label: "Join",
        title: "Create Account",
        accessLevel: "public",
        parent: "HOME",
    } as const satisfies RouteMetadata,
}

// ============================================================================
// PRIVATE ROUTES (requires authentication)
// ============================================================================

/**
 * TODO:: document
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
 * TODO:: document
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
 * TODO:: document
 */
export const ALL_ROUTES = {
    ...PUBLIC_ROUTES,
    ...PRIVATE_ROUTES,
    ...ADMIN_ROUTES,
} as const;

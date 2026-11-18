

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

import {RouteMetadata} from "@/lib/constants/routes";
import {getBreadcrumbs} from "@/lib/utilities/breadcrumb-utils";

/**
 * TODO:: document
 *
 * @param route
 * @param params
 */
export function resolvePath(
    route: RouteMetadata,
    params?: Record<string, string>
): string {

    if (typeof route.path === "string") {
        return route.path;
    }

    if (!params) {
        throw new Error(`Route requires parameters: ${route.label}`);
    }
    return route.path(params);
}

/**
 * TODO:: document
 *
 * @param route
 * @param params
 * @param overrides
 */
export function getPageHeaderProps(
    route: RouteMetadata,
    params?: Record<string, string>,
    overrides?: { title?: string; }
): { title: string; breadcrumb: Array<{ label: string; href?: string }> } {
    return {
        title: overrides?.title ?? route.title,
        breadcrumb: getBreadcrumbs(route, params),
    };
}

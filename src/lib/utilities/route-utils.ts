/**
 * @fileOverview    TODO: document
 * @module          core-application
 *
 * @status          Requires documentation
 */

import {MISSING_ROUTE_PARAMS, RouteMetadata} from "@/lib/constants/routes";
import {getBreadcrumbs} from "@/lib/utilities/breadcrumb-utils";

/**
 * Resolves a route path definition into a static URL string.
 *
 * @param       route       The route metadata object containing the static path string or builder function
 * @param       params      Optional; parameters satisfying dynamic route URL placeholders
 *
 * @returns     {string}    The fully resolved static URL path string.
 *
 * @throws      {Error}     Throws an error if dynamic parameters are required by the route but were omitted.
 */
export function resolvePath(
    route: RouteMetadata,
    params?: Record<string, string>
): string {

    if (typeof route.path === "string") {
        return route.path;
    }

    if (!params) {
        // Programmer error: a dynamic route was resolved without its parameters. Thrown deliberately, not turned into a
        // user alert: it surfaces through the error boundary on the client and `onRequestError` (logged) on the server.
        throw new Error(`${MISSING_ROUTE_PARAMS} ${route.label}`);
    }
    return route.path(params);
}

/**
 * Constructs property objects required by PageHeader UI components, including page titles and resolved breadcrumbs.
 *
 * @param       route           The route metadata describing the active page
 * @param       [params]        Optional; parameter object for dynamic breadcrumb route path resolution
 * @param       [overrides]     Optional; visual overrides for title customization
 *
 * @returns     {Object}        Header props containing page title and breadcrumbs array.
 */
export function getPageHeaderProps(
    route: RouteMetadata,
    params?: Record<string, string>,
    overrides?: { title?: string; }
): {
    title: string;
    breadcrumb: Array<{
        label: string;
        href?: string
    }>
} {

    return {
        title: overrides?.title ?? route.title,
        breadcrumb: getBreadcrumbs(route, params),
    };
}

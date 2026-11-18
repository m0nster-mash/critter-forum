import {RouteMetadata} from "@/lib/constants/routes";
import {getBreadcrumbs} from "@/lib/utilities/breadcrumb-utils";

/**
 * Resolves a route path definition into a static URL string.
 *
 * @param   {RouteMetadata}             route       The route metadata object containing the static path string or
 *                                                  builder function
 * @param   {Record<string, string>}    [params]    Optional; parameters satisfying dynamic route URL placeholders
 *
 * @return  {string}    The fully resolved static URL path string.
 *
 * @throws  {Error} Throws an error if dynamic parameters are required by the route but were omitted.
 */
export function resolvePath(
    route: RouteMetadata,
    params?: Record<string, string>
): string {

    if (typeof route.path === "string") {
        return route.path;
    }

    if (!params) {
        // TODO:: migrate to proper error handling
        throw new Error(`Route requires parameters: ${route.label}`);
    }
    return route.path(params);
}

/**
 * Constructs property objects required by PageHeader UI components, including page titles and resolved breadcrumbs.
 *
 * @param   {RouteMetadata}             route               The route metadata describing the active page
 * @param   {Record<string, string>}    [params]            Optional parameter object for dynamic breadcrumb route path
 *                                                          resolution
 * @param   {Object}                    [overrides]         Optional visual overrides for title customization
 * @param   {string}                    [overrides.title]   Custom header title string overriding default route titles
 *
 * @return  {{title: string, breadcrumb: Array<{label: string, href?: string}>}}    Header props containing page title
 *                                                                                  and breadcrumbs array.
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
